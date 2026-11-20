import { AuthToken, User } from "tweeter-shared";
import { FakeData } from "tweeter-shared/dist/util/FakeData";
import { Service } from "./Service";
import { ServerFacade } from "../net/ServerFacade";

export class FollowService implements Service {
  private serverFacade: ServerFacade = new ServerFacade();
  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollowee: User | null,
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.serverFacade.getMoreFollowees({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastFollowee ? lastFollowee.dto : null,
    });
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollower: User | null,
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.serverFacade.getMoreFollowers({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastFollower ? lastFollower.dto : null,
    });
  }
}
