// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User, UserDto } from "tweeter-shared";
import { FakeData } from "tweeter-shared/dist/util/FakeData";
import { Service } from "./Service";

export class FollowService extends Service {
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFollowee: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastFollowee, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFollower: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastFollower, pageSize, userAlias);
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[UserDto[], boolean]> {
    return this.toDtoPage(
      FakeData.instance.getPageOfUsers(
        User.fromDto(lastItem),
        pageSize,
        userAlias,
      ),
    );
  }
}
