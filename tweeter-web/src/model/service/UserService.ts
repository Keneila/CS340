// AI-assisted: see AI-ATTRIBUTION.md
import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class UserService implements Service {
  private serverFacade: ServerFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return this.serverFacade.getUser({
      token: authToken.token,
      alias: alias,
    });
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> {
    return this.serverFacade.login({
      alias: alias,
      password: password,
    });
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    return this.serverFacade.register({
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension,
    });
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    return this.serverFacade.isFollower({
      token: authToken.token,
      userAlias: user.alias,
      selectedUserAlias: selectedUser.alias,
    });
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    return this.serverFacade.getFolloweeCount({
      token: authToken.token,
      userAlias: user.alias,
    });
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    return this.serverFacade.getFollowerCount({
      token: authToken.token,
      userAlias: user.alias,
    });
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.serverFacade.unfollow({
      token: authToken.token,
      userAlias: userToUnfollow.alias,
    });
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.serverFacade.follow({
      token: authToken.token,
      userAlias: userToFollow.alias,
    });
  }

  public async logout(authToken: AuthToken): Promise<void> {
    return this.serverFacade.logout({
      token: authToken.token,
    });
  }
}
