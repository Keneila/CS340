// AI-assisted: see AI-ATTRIBUTION.md
import bcrypt from "bcryptjs";
import { AuthToken, UserDto } from "tweeter-shared";
import { AuthTokenDAO } from "../dao/AuthTokenDAO";
import { DAOFactory } from "../dao/DAOFactory";
import { FollowDAO } from "../dao/FollowDAO";
import { ImageDAO } from "../dao/ImageDAO";
import { UserDAO } from "../dao/UserDAO";
import {
  AUTH_TOKEN_TIMEOUT_SECONDS,
  AuthorizationService,
} from "./AuthorizationService";
import { Service } from "./Service";

// bcrypt work factor: each +1 doubles hashing time. 10 is the common default.
const BCRYPT_SALT_ROUNDS = 10;

export class UserService extends Service {
  private readonly userDAO: UserDAO;
  private readonly authTokenDAO: AuthTokenDAO;
  private readonly followDAO: FollowDAO;
  private readonly imageDAO: ImageDAO;
  private readonly authorizationService: AuthorizationService;

  public constructor(daoFactory: DAOFactory) {
    super(daoFactory);
    this.userDAO = daoFactory.getUserDAO();
    this.authTokenDAO = daoFactory.getAuthTokenDAO();
    this.followDAO = daoFactory.getFollowDAO();
    this.imageDAO = daoFactory.getImageDAO();
    this.authorizationService = new AuthorizationService(daoFactory);
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    await this.authorizationService.authenticate(token);
    return this.userDAO.getUser(alias);
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[UserDto, string]> {
    const passwordHash = await this.userDAO.getPasswordHash(alias);
    const user = await this.userDAO.getUser(alias);

    // Same message for an unknown alias and a wrong password, so the error
    // does not reveal which aliases exist.
    if (
      passwordHash === null ||
      user === null ||
      !(await bcrypt.compare(password, passwordHash))
    ) {
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
    if ((await this.userDAO.getUser(alias)) !== null) {
      throw new Error(`[bad-request] Alias ${alias} is already taken`);
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const imageUrl = await this.imageDAO.putImage(
      `${alias}.${imageFileExtension}`,
      userImageBytes,
    );
    const user: UserDto = { firstName, lastName, alias, imageUrl };
    await this.userDAO.putUser(user, passwordHash);

    return [user, await this.startSession(alias)];
  }

  // Creates and stores a new auth token for alias and returns the token string.
  // The stored timestamp is in epoch seconds, matching AuthorizationService.
  private async startSession(alias: string): Promise<string> {
    const authToken = AuthToken.Generate();
    const now = Math.floor(authToken.timestamp / 1000);
    await this.authTokenDAO.putAuthToken(
      authToken.token,
      alias,
      now,
      now + AUTH_TOKEN_TIMEOUT_SECONDS,
    );
    return authToken.token;
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string,
  ): Promise<boolean> {
    await this.authorizationService.authenticate(token);
    return this.followDAO.isFollower(userAlias, selectedUserAlias);
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    await this.authorizationService.authenticate(token);
    return this.userDAO.getFolloweeCount(userAlias);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string,
  ): Promise<number> {
    await this.authorizationService.authenticate(token);
    return this.userDAO.getFollowerCount(userAlias);
  }

  // Makes the current user stop following userToUnfollowAlias and returns
  // that user's updated counts. Does nothing if not already following.
  public async unfollow(
    token: string,
    userToUnfollowAlias: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const currentAlias = await this.authenticateFollowChange(
      token,
      userToUnfollowAlias,
    );

    if (await this.followDAO.isFollower(currentAlias, userToUnfollowAlias)) {
      await this.followDAO.deleteFollow(currentAlias, userToUnfollowAlias);
      await this.changeFollowCounts(currentAlias, userToUnfollowAlias, -1);
    }

    return this.getFollowCounts(userToUnfollowAlias);
  }

  // Makes the current user follow userToFollowAlias and returns that user's
  // updated counts. Does nothing if already following.
  public async follow(
    token: string,
    userToFollowAlias: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const currentAlias = await this.authenticateFollowChange(
      token,
      userToFollowAlias,
    );

    if (!(await this.followDAO.isFollower(currentAlias, userToFollowAlias))) {
      await this.followDAO.putFollow(currentAlias, userToFollowAlias);
      await this.changeFollowCounts(currentAlias, userToFollowAlias, 1);
    }

    return this.getFollowCounts(userToFollowAlias);
  }

  // Authenticates the token and checks that the other user exists and is not
  // the current user. Returns the current user's alias.
  private async authenticateFollowChange(
    token: string,
    otherAlias: string,
  ): Promise<string> {
    const currentAlias = await this.authorizationService.authenticate(token);

    if (currentAlias === otherAlias) {
      throw new Error("[bad-request] You cannot follow or unfollow yourself");
    }
    if ((await this.userDAO.getUser(otherAlias)) === null) {
      throw new Error(`[bad-request] User ${otherAlias} does not exist`);
    }

    return currentAlias;
  }

  // Adds delta to the follower's followee count and the followee's follower count.
  private async changeFollowCounts(
    followerAlias: string,
    followeeAlias: string,
    delta: number,
  ): Promise<void> {
    await Promise.all([
      this.userDAO.changeFolloweeCount(followerAlias, delta),
      this.userDAO.changeFollowerCount(followeeAlias, delta),
    ]);
  }

  // Reads the counts straight from the DAO; callers have already authenticated.
  private async getFollowCounts(
    userAlias: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerCount = await this.userDAO.getFollowerCount(userAlias);
    const followeeCount = await this.userDAO.getFolloweeCount(userAlias);

    return [followerCount, followeeCount];
  }

  public async logout(token: string): Promise<void> {
    await this.authTokenDAO.deleteAuthToken(token);
  }
}
