// AI-assisted: see AI-ATTRIBUTION.md
// TEMPORARY: DAOs backed by FakeData so the server keeps running until the
// DynamoDB/S3 DAOs exist. Delete this file once DynamoDAOFactory replaces it.
import { FakeData, Status, StatusDto, UserDto } from "tweeter-shared";
import { AuthTokenDAO, AuthTokenRecord } from "../AuthTokenDAO";
import { DAOFactory } from "../DAOFactory";
import { FeedDAO } from "../FeedDAO";
import { FollowDAO } from "../FollowDAO";
import { ImageDAO } from "../ImageDAO";
import { StoryDAO } from "../StoryDAO";
import { UserDAO } from "../UserDAO";

const getFakeStatusPage = (
  pageSize: number,
  lastItem: StatusDto | null,
): [StatusDto[], boolean] => {
  const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
    Status.fromDto(lastItem),
    pageSize,
  );
  return [statuses.map((status) => status.dto), hasMore];
};

export class FakeUserDAO implements UserDAO {
  public async putUser(user: UserDto, passwordHash: string): Promise<void> {}

  public async getUser(alias: string): Promise<UserDto | null> {
    const user = FakeData.instance.findUserByAlias(alias);
    return user ? user.dto : null;
  }

  public async getUsers(aliases: string[]): Promise<UserDto[]> {
    const users: UserDto[] = [];
    for (const alias of aliases) {
      const user = await this.getUser(alias);
      if (user !== null) {
        users.push(user);
      }
    }
    return users;
  }

  public async getPasswordHash(alias: string): Promise<string | null> {
    return null;
  }

  public async getFollowerCount(alias: string): Promise<number> {
    return await FakeData.instance.getFollowerCount(alias);
  }

  public async getFolloweeCount(alias: string): Promise<number> {
    return await FakeData.instance.getFolloweeCount(alias);
  }

  public async changeFollowerCount(alias: string, delta: number): Promise<void> {}

  public async changeFolloweeCount(alias: string, delta: number): Promise<void> {}
}

export class FakeAuthTokenDAO implements AuthTokenDAO {
  public async putAuthToken(
    token: string,
    alias: string,
    timestamp: number,
  ): Promise<void> {}

  // Every token belongs to the first fake user and is never expired.
  public async getAuthToken(token: string): Promise<AuthTokenRecord | null> {
    const user = FakeData.instance.firstUser;
    return user ? { token, alias: user.alias, lastUsed: Date.now() } : null;
  }

  public async updateLastUsed(token: string, timestamp: number): Promise<void> {}

  public async deleteAuthToken(token: string): Promise<void> {}
}

export class FakeFollowDAO implements FollowDAO {
  public async putFollow(
    followerAlias: string,
    followeeAlias: string,
  ): Promise<void> {}

  public async deleteFollow(
    followerAlias: string,
    followeeAlias: string,
  ): Promise<void> {}

  public async isFollower(
    followerAlias: string,
    followeeAlias: string,
  ): Promise<boolean> {
    return FakeData.instance.isFollower();
  }

  public async getPageOfFolloweeAliases(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null,
  ): Promise<[aliases: string[], hasMore: boolean]> {
    return this.getFakeAliasPage(followerAlias, pageSize, lastFolloweeAlias);
  }

  public async getPageOfFollowerAliases(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null,
  ): Promise<[aliases: string[], hasMore: boolean]> {
    return this.getFakeAliasPage(followeeAlias, pageSize, lastFollowerAlias);
  }

  private getFakeAliasPage(
    alias: string,
    pageSize: number,
    lastAlias: string | null,
  ): [string[], boolean] {
    const lastUser =
      lastAlias === null ? null : FakeData.instance.findUserByAlias(lastAlias);
    const [users, hasMore] = FakeData.instance.getPageOfUsers(
      lastUser,
      pageSize,
      alias,
    );
    return [users.map((user) => user.alias), hasMore];
  }
}

export class FakeStoryDAO implements StoryDAO {
  public async putStatus(status: StatusDto): Promise<void> {}

  public async getPageOfStory(
    authorAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[statuses: StatusDto[], hasMore: boolean]> {
    return getFakeStatusPage(pageSize, lastItem);
  }
}

export class FakeFeedDAO implements FeedDAO {
  public async putFeedItems(
    receiverAliases: string[],
    status: StatusDto,
  ): Promise<void> {}

  public async getPageOfFeed(
    receiverAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[statuses: StatusDto[], hasMore: boolean]> {
    return getFakeStatusPage(pageSize, lastItem);
  }
}

export class FakeImageDAO implements ImageDAO {
  // Returns an existing fake profile image instead of uploading anything.
  public async putImage(
    fileName: string,
    imageStringBase64Encoded: string,
  ): Promise<string> {
    return FakeData.instance.firstUser?.imageUrl ?? "";
  }
}

export class FakeDAOFactory implements DAOFactory {
  public getUserDAO(): UserDAO {
    return new FakeUserDAO();
  }

  public getAuthTokenDAO(): AuthTokenDAO {
    return new FakeAuthTokenDAO();
  }

  public getFollowDAO(): FollowDAO {
    return new FakeFollowDAO();
  }

  public getStoryDAO(): StoryDAO {
    return new FakeStoryDAO();
  }

  public getFeedDAO(): FeedDAO {
    return new FakeFeedDAO();
  }

  public getImageDAO(): ImageDAO {
    return new FakeImageDAO();
  }
}
