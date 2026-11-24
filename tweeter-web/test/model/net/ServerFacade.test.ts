/**
 * @jest-environment node
 */
// AI-assisted: see AI-ATTRIBUTION.md
// The docblock above must be the first thing in the file or Jest ignores it.
// Integration tests: these call the deployed server through the real
// ServerFacade, which reads and writes the DynamoDB tables. The node
// environment is used because jsdom has no fetch.
//
// They expect the tables to hold the data from tweeter-server's SeedData
// script: @allen (password "password") with more than 10 followers. Expected
// values are checked against what the server itself reports (counts, page
// order) rather than a fixed list, so following, unfollowing, or posting in
// the app does not break them.
import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../../../src/model/net/ServerFacade";

// Real server calls (cold starts, password hashing) can exceed Jest's 5s default.
jest.setTimeout(30_000);

const SEEDED_ALIAS = "@allen";
const SEEDED_PASSWORD = "password";
const PAGE_SIZE = 10;

describe("ServerFacade integration", () => {
  const serverFacade = new ServerFacade();
  let token: string;

  beforeAll(async () => {
    const [, authToken] = await serverFacade.login({
      alias: SEEDED_ALIAS,
      password: SEEDED_PASSWORD,
    });
    token = authToken.token;
  });

  afterAll(async () => {
    await serverFacade.logout({ token: token });
  });

  describe("register", () => {
    // Registering creates a real user (and uploads an image), so each run
    // uses a new alias. Letters and digits only, as the server requires.
    const alias = `@test${Date.now()}`;
    let registeredToken: string | null = null;

    afterAll(async () => {
      if (registeredToken !== null) {
        await serverFacade.logout({ token: registeredToken });
      }
    });

    it("creates the user and returns it with a valid auth token", async () => {
      const [user, authToken] = await serverFacade.register({
        firstName: "Test",
        lastName: "User",
        alias: alias,
        password: "password",
        userImageBytes: "aGVsbG8gd29ybGQ=",
        imageFileExtension: "png",
      });
      registeredToken = authToken.token;

      expect(user).toBeInstanceOf(User);
      expect(user.firstName).toBe("Test");
      expect(user.lastName).toBe("User");
      expect(user.alias).toBe(alias);
      expect(user.imageUrl.length).toBeGreaterThan(0);

      expect(authToken).toBeInstanceOf(AuthToken);
      expect(typeof authToken.token).toBe("string");
      expect(authToken.token.length).toBeGreaterThan(0);

      // The new user is now stored and can be looked up.
      const storedUser = await serverFacade.getUser({
        token: authToken.token,
        alias: alias,
      });
      expect(storedUser).not.toBeNull();
      expect(storedUser!.dto).toEqual(user.dto);
    });

    it("rejects an alias that is already taken", async () => {
      await expect(
        serverFacade.register({
          firstName: "Test",
          lastName: "User",
          alias: SEEDED_ALIAS,
          password: "password",
          userImageBytes: "aGVsbG8gd29ybGQ=",
          imageFileExtension: "png",
        }),
      ).rejects.toThrow();
    });
  });

  describe("getMoreFollowers", () => {
    it("returns the first page of followers, omitting the requested user", async () => {
      const [followers, hasMore] = await serverFacade.getMoreFollowers({
        token: token,
        userAlias: SEEDED_ALIAS,
        pageSize: PAGE_SIZE,
        lastItem: null,
      });

      expect(followers).toHaveLength(PAGE_SIZE);
      expect(hasMore).toBe(true);
      followers.forEach((follower) => expect(follower).toBeInstanceOf(User));
      expect(followers.some((f) => f.alias === SEEDED_ALIAS)).toBe(false);

      // Followers come back in alias order (the table's sort key).
      const aliases = followers.map((f) => f.alias);
      expect(aliases).toEqual([...aliases].sort());
    });

    it("returns the next page of followers after the given last item", async () => {
      const [firstPage] = await serverFacade.getMoreFollowers({
        token: token,
        userAlias: SEEDED_ALIAS,
        pageSize: PAGE_SIZE,
        lastItem: null,
      });
      const lastItem = firstPage[firstPage.length - 1];

      const [followers, hasMore] = await serverFacade.getMoreFollowers({
        token: token,
        userAlias: SEEDED_ALIAS,
        pageSize: PAGE_SIZE,
        lastItem: lastItem.dto,
      });

      expect(followers.length).toBeGreaterThan(0);
      expect(followers.length).toBeLessThanOrEqual(PAGE_SIZE);
      if (hasMore) {
        expect(followers).toHaveLength(PAGE_SIZE);
      }
      followers.forEach((follower) => {
        expect(follower).toBeInstanceOf(User);
        expect(follower.alias > lastItem.alias).toBe(true);
      });
      expect(
        followers.some((f) => firstPage.some((first) => first.equals(f))),
      ).toBe(false);
    });

    it("pages through exactly as many followers as the follower count", async () => {
      const allAliases: string[] = [];
      let lastItem: User | null = null;
      let hasMore = true;

      while (hasMore) {
        const [page, more]: [User[], boolean] =
          await serverFacade.getMoreFollowers({
            token: token,
            userAlias: SEEDED_ALIAS,
            pageSize: PAGE_SIZE,
            lastItem: lastItem ? lastItem.dto : null,
          });
        allAliases.push(...page.map((f) => f.alias));
        lastItem = page.length > 0 ? page[page.length - 1] : lastItem;
        hasMore = more;
      }

      const count = await serverFacade.getFollowerCount({
        token: token,
        userAlias: SEEDED_ALIAS,
      });

      expect(allAliases).toHaveLength(count);
      expect(new Set(allAliases).size).toBe(allAliases.length);
    });
  });

  describe("getFollowerCount", () => {
    it("returns the user's follower count", async () => {
      const count = await serverFacade.getFollowerCount({
        token: token,
        userAlias: SEEDED_ALIAS,
      });

      expect(Number.isInteger(count)).toBe(true);
      expect(count).toBeGreaterThan(PAGE_SIZE);
    });
  });

  describe("getFolloweeCount", () => {
    it("returns the user's followee count", async () => {
      const count = await serverFacade.getFolloweeCount({
        token: token,
        userAlias: SEEDED_ALIAS,
      });

      expect(Number.isInteger(count)).toBe(true);
      expect(count).toBeGreaterThan(0);
    });
  });

  describe("authentication", () => {
    it("rejects a request with an invalid auth token", async () => {
      await expect(
        serverFacade.getFollowerCount({
          token: "not-a-real-token",
          userAlias: SEEDED_ALIAS,
        }),
      ).rejects.toThrow();
    });
  });
});
