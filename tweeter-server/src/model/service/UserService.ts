// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService extends Service {
  public async getUser(
    token: string,
    alias: string,
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling the database
    const user = FakeData.instance.findUserByAlias(alias);
    return user ? user.dto : null;
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[UserDto, string]> {
    // TODO: Replace with the result of calling the database
    return this.getsignInFakeData("Invalid alias or password");
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string,
  ): Promise<[UserDto, string]> {
    // TODO: Replace with the result of calling the database
    return this.getsignInFakeData("Invalid registration");
  }

  private async getsignInFakeData(
    errorMessage: string,
  ): Promise<[UserDto, string]> {
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error(`[bad-request] ${errorMessage}`);
    }

    return [user.dto, FakeData.instance.authToken.token];
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string,
  ): Promise<boolean> {
    // TODO: Replace with the result of calling the database
    return await FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    // TODO: Replace with the result of calling the database
    return await FakeData.instance.getFolloweeCount(userAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    // TODO: Replace with the result of calling the database
    return await FakeData.instance.getFollowerCount(userAlias);
  }

  public async unfollow(
    token: string,
    userToUnfollowAlias: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // TODO: Remove the follow relationship from the database

    return this.getFollowCounts(token, userToUnfollowAlias);
  }

  public async follow(
    token: string,
    userToFollowAlias: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // TODO: Add the follow relationship to the database

    return this.getFollowCounts(token, userToFollowAlias);
  }

  private async getFollowCounts(
    token: string,
    userAlias: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerCount = await this.getFollowerCount(token, userAlias);
    const followeeCount = await this.getFolloweeCount(token, userAlias);

    return [followerCount, followeeCount];
  }

  public async logout(token: string): Promise<void> {
    // TODO: Invalidate the token in the database
  }
}
