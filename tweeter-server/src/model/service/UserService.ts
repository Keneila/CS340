// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, UserDto } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/AuthTokenDAO";
import { DAOFactory } from "../dao/DAOFactory";
import { FollowDAO } from "../dao/FollowDAO";
import { ImageDAO } from "../dao/ImageDAO";
import { UserDAO } from "../dao/UserDAO";
import { Service } from "./Service";

export class UserService extends Service {
  private readonly userDAO: UserDAO;
  private readonly authTokenDAO: AuthTokenDAO;
  private readonly followDAO: FollowDAO;
  private readonly imageDAO: ImageDAO;

  public constructor(daoFactory: DAOFactory) {
    super(daoFactory);
    this.userDAO = daoFactory.getUserDAO();
    this.authTokenDAO = daoFactory.getAuthTokenDAO();
    this.followDAO = daoFactory.getFollowDAO();
    this.imageDAO = daoFactory.getImageDAO();
  }

  public async getUser(
    token: string,
    alias: string,
  ): Promise<UserDto | null> {
    return this.userDAO.getUser(alias);
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[UserDto, string]> {
    // TODO: Compare password to userDAO.getPasswordHash(alias) with bcryptjs
    const user = await this.userDAO.getUser(alias);
    if (user === null) {
      throw new Error("[bad-request] Invalid alias or password");
    }

    return [user, await this.startSession(alias)];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string,
  ): Promise<[UserDto, string]> {
    // TODO: Reject the alias if it is already taken
    const imageUrl = await this.imageDAO.putImage(
      `${alias}.${imageFileExtension}`,
      userImageBytes,
    );
    const user: UserDto = { firstName, lastName, alias, imageUrl };
    // TODO: Hash the password with bcryptjs, then save with userDAO.putUser(user, passwordHash)

    return [user, await this.startSession(alias)];
  }

  // Creates and stores a new auth token for alias and returns the token string.
  private async startSession(alias: string): Promise<string> {
    const authToken = AuthToken.Generate();
    await this.authTokenDAO.putAuthToken(
      authToken.token,
      alias,
      authToken.timestamp,
    );
    return authToken.token;
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string,
  ): Promise<boolean> {
    return this.followDAO.isFollower(userAlias, selectedUserAlias);
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    return this.userDAO.getFolloweeCount(userAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    return this.userDAO.getFollowerCount(userAlias);
  }

  public async unfollow(
    token: string,
    userToUnfollowAlias: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // TODO: Get the current user's alias from the token, then
    // followDAO.deleteFollow and decrement both users' counts

    return this.getFollowCounts(token, userToUnfollowAlias);
  }

  public async follow(
    token: string,
    userToFollowAlias: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // TODO: Get the current user's alias from the token, then
    // followDAO.putFollow and increment both users' counts

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
    await this.authTokenDAO.deleteAuthToken(token);
  }
}
