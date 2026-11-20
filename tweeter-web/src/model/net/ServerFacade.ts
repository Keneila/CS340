// AI-assisted: see AI-ATTRIBUTION.md
import {
  AuthToken,
  FollowResponse,
  GetCountRequest,
  GetCountResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  PagedItemRequest,
  PagedItemResponse,
  PagedStatusItemRequest,
  PagedUserItemRequest,
  PostStatusRequest,
  RegisterRequest,
  Status,
  TweeterRequest,
  TweeterResponse,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://dj160bizel.execute-api.us-east-2.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
    return this.getMoreItems(request, "/followees", User.fromDto, "followees");
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest,
  ): Promise<[User[], boolean]> {
    return this.getMoreItems(request, "/followers", User.fromDto, "followers");
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest,
  ): Promise<[Status[], boolean]> {
    return this.getMoreItems(request, "/feed", Status.fromDto, "feed items");
  }

  public async getMoreStoryItems(
    request: PagedStatusItemRequest,
  ): Promise<[Status[], boolean]> {
    return this.getMoreItems(request, "/story", Status.fromDto, "story items");
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    return this.signIn(request, "/login", "Invalid alias or password");
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    return this.signIn(request, "/register", "Invalid registration");
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    // A null user means no user has that alias.
    return this.doRequest<GetUserRequest, GetUserResponse, User | null>(
      request,
      "/getuser",
      (response) => (response.user ? User.fromDto(response.user) : null),
    );
  }

  public async logout(request: LogoutRequest): Promise<void> {
    return this.doRequest<LogoutRequest, TweeterResponse, void>(
      request,
      "/logout",
      () => undefined,
    );
  }

  public async isFollower(request: IsFollowerRequest): Promise<boolean> {
    return this.doRequest<IsFollowerRequest, IsFollowerResponse, boolean>(
      request,
      "/isfollower",
      (response) => response.isFollower,
    );
  }

  public async getFolloweeCount(request: GetCountRequest): Promise<number> {
    return this.getCount(request, "/followeecount");
  }

  public async getFollowerCount(request: GetCountRequest): Promise<number> {
    return this.getCount(request, "/followercount");
  }

  public async follow(
    request: GetCountRequest,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.changeFollow(request, "/follow");
  }

  public async unfollow(
    request: GetCountRequest,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.changeFollow(request, "/unfollow");
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    return this.doRequest<PostStatusRequest, TweeterResponse, void>(
      request,
      "/poststatus",
      () => undefined,
    );
  }

  // Template for every call: post the request, then either extract the
  // result from a successful response or log and throw the server's error.
  private async doRequest<
    REQ extends TweeterRequest,
    RES extends TweeterResponse,
    R,
  >(
    request: REQ,
    endpoint: string,
    extract: (response: RES) => R,
  ): Promise<R> {
    const response = await this.clientCommunicator.doPost<REQ, RES>(
      request,
      endpoint,
    );

    if (response.success) {
      return extract(response);
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  // Loads a page of DTOs and converts them to domain objects (User, Status).
  private async getMoreItems<DTO, ITEM>(
    request: PagedItemRequest<DTO>,
    endpoint: string,
    fromDto: (dto: DTO | null) => ITEM | null,
    itemDescription: string,
  ): Promise<[ITEM[], boolean]> {
    return this.doRequest<
      PagedItemRequest<DTO>,
      PagedItemResponse<DTO>,
      [ITEM[], boolean]
    >(request, endpoint, (response) => {
      if (response.items == null) {
        throw new Error(`No ${itemDescription} found`);
      }
      const items = response.items.map((dto) => fromDto(dto) as ITEM);
      return [items, response.hasMore];
    });
  }

  // Shared by login and register, which both return a user and a token.
  private async signIn<REQ extends TweeterRequest>(
    request: REQ,
    endpoint: string,
    errorMessage: string,
  ): Promise<[User, AuthToken]> {
    return this.doRequest<REQ, LoginResponse, [User, AuthToken]>(
      request,
      endpoint,
      (response) => {
        const user = response.user ? User.fromDto(response.user) : null;
        if (user == null || response.token == null) {
          throw new Error(errorMessage);
        }
        return [user, new AuthToken(response.token, Date.now())];
      },
    );
  }

  private async getCount(
    request: GetCountRequest,
    endpoint: string,
  ): Promise<number> {
    return this.doRequest<GetCountRequest, GetCountResponse, number>(
      request,
      endpoint,
      (response) => response.count,
    );
  }

  private async changeFollow(
    request: GetCountRequest,
    endpoint: string,
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.doRequest<
      GetCountRequest,
      FollowResponse,
      [followerCount: number, followeeCount: number]
    >(request, endpoint, (response) => [
      response.followerCount,
      response.followeeCount,
    ]);
  }
}
