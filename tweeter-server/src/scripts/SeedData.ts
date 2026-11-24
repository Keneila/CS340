// AI-assisted: see AI-ATTRIBUTION.md
//
// Fills the DynamoDB tables with test data, writing through the real DAOs so
// every item has exactly the format the app reads.
//
// Run from the tweeter-server folder, after deploying the tables:
//   npm run build
//   node dist/scripts/SeedData.js
// It uses your local AWS credentials (the same ones sam deploy uses).
//
// What it creates:
// - The 22 FakeData users (@allen, @amy, @bob, ...), all with the password
//   "password" and their existing profile images.
// - @allen follows everyone and everyone follows @allen, and each other user
//   also follows the next one, so @allen has 21 followers and 21 followees.
// - 12 statuses by @allen and 2 by each other user, with @mentions and URLs,
//   in the authors' stories and their followers' feeds. @allen's feed gets
//   42 statuses.
// So every tab has more than 10 items when logged in as @allen.
//
// It stops without writing anything if @allen already exists, since running
// it twice would reset the follow counts and duplicate statuses.
import bcrypt from "bcryptjs";
import { FakeData, StatusDto, UserDto } from "tweeter-shared";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";
import { sleep } from "../model/dao/dynamodb/DynamoClient";

const PASSWORD = "password";
const MAIN_USER_STATUS_COUNT = 12;
const OTHER_USER_STATUS_COUNT = 2;
const MAX_RETRIES = 8;

// The tables have 1 write unit each, so writes get throttled. Retries a
// throttled write with a growing delay instead of failing the whole script.
const withRetry = async (write: () => Promise<void>): Promise<void> => {
  for (let attempt = 0; ; attempt++) {
    try {
      await write();
      return;
    } catch (error) {
      const name = (error as Error).name;
      const throttled =
        name === "ProvisionedThroughputExceededException" ||
        name === "ThrottlingException";
      if (!throttled || attempt >= MAX_RETRIES) {
        throw error;
      }
      await sleep(200 * 2 ** attempt);
    }
  }
};

const makePost = (author: UserDto, mentioned: UserDto, n: number): string => {
  const posts = [
    `Hello from ${author.firstName}! Say hi to ${mentioned.alias}.`,
    `Status #${n} from ${author.alias}. Reading https://byu.edu today.`,
    `${mentioned.alias}, are you trying out Tweeter too? (#${n})`,
  ];
  return posts[n % posts.length];
};

const main = async (): Promise<void> => {
  const factory = new DynamoDAOFactory();
  const userDAO = factory.getUserDAO();
  const followDAO = factory.getFollowDAO();
  const storyDAO = factory.getStoryDAO();
  const feedDAO = factory.getFeedDAO();

  const users: UserDto[] = FakeData.instance.fakeUsers.map((user) => user.dto);
  const [mainUser, ...others] = users;

  if ((await userDAO.getUser(mainUser.alias)) !== null) {
    console.log(
      `${mainUser.alias} already exists, so the tables look seeded already. ` +
        "Nothing was written.",
    );
    return;
  }

  // Users (one hash shared by all, since they share a password)
  console.log(`Adding ${users.length} users...`);
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  for (const user of users) {
    await withRetry(() => userDAO.putUser(user, passwordHash));
  }

  // Follows: [follower, followee]
  const follows: [string, string][] = [];
  for (const [i, other] of others.entries()) {
    follows.push([mainUser.alias, other.alias]);
    follows.push([other.alias, mainUser.alias]);
    follows.push([other.alias, others[(i + 1) % others.length].alias]);
  }

  console.log(`Adding ${follows.length} follows...`);
  const followersOf = new Map<string, string[]>();
  const followerCounts = new Map<string, number>();
  const followeeCounts = new Map<string, number>();
  for (const [follower, followee] of follows) {
    await withRetry(() => followDAO.putFollow(follower, followee));
    followersOf.set(followee, [...(followersOf.get(followee) ?? []), follower]);
    followerCounts.set(followee, (followerCounts.get(followee) ?? 0) + 1);
    followeeCounts.set(follower, (followeeCounts.get(follower) ?? 0) + 1);
  }

  console.log("Setting follow counts...");
  for (const user of users) {
    const followers = followerCounts.get(user.alias) ?? 0;
    const followees = followeeCounts.get(user.alias) ?? 0;
    await withRetry(() => userDAO.changeFollowerCount(user.alias, followers));
    await withRetry(() => userDAO.changeFolloweeCount(user.alias, followees));
  }

  // Statuses, with unique timestamps one minute apart ending now
  const posts: { author: UserDto; post: string }[] = [];
  for (let n = 0; n < MAIN_USER_STATUS_COUNT; n++) {
    posts.push({
      author: mainUser,
      post: makePost(mainUser, others[n % others.length], n),
    });
  }
  for (let n = 0; n < OTHER_USER_STATUS_COUNT; n++) {
    for (const other of others) {
      posts.push({ author: other, post: makePost(other, mainUser, n) });
    }
  }

  console.log(`Adding ${posts.length} statuses to stories and feeds...`);
  const startTime = Date.now() - posts.length * 60_000;
  for (const [i, { author, post }] of posts.entries()) {
    const status: StatusDto = {
      post,
      user: author,
      timestamp: startTime + i * 60_000,
    };
    await withRetry(() => storyDAO.putStatus(status));
    await withRetry(() =>
      feedDAO.putFeedItems(followersOf.get(author.alias) ?? [], status),
    );
  }

  console.log(
    `Done. Log in as ${mainUser.alias} with password "${PASSWORD}".`,
  );
};

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exitCode = 1;
});
