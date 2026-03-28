import { Status } from "tweeter-shared/dist/model/domain/Status";
import { StatusPresenter } from "./StatusPresenter";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FeedPresenter extends StatusPresenter {
  protected itemDescription(): string {
    return "load feed items";
  }
  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeedItems(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem,
    );
  }
}
