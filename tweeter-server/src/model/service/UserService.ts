// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, FakeData, Status, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service {
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
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(
      authToken.token,
      userToUnfollow.alias,
    );
    const followeeCount = await this.getFolloweeCount(
      authToken.token,
      userToUnfollow.alias,
    );

    return [followerCount, followeeCount];
  }

  public async follow(
    token: string,
    userToFollowAlias: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // TODO: Add the follow relationship to the database

    const followerCount = await this.getFollowerCount(
      token,
      userToFollowAlias,
    );
    const followeeCount = await this.getFolloweeCount(
      token,
      userToFollowAlias,
    );

    return [followerCount, followeeCount];
  }

  public async logout(token: string): Promise<void> {
    // TODO: Invalidate the token in the database
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }
}
