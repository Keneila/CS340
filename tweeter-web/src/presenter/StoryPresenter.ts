import { StatusService } from "../model.service/StatusService";
import { StatusPresenter, StatusView } from "./StatusPresenter";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";

export const PAGE_SIZE = 10;

export class StoryPresenter extends StatusPresenter {
    private service: StatusService;
    constructor(view: StatusView) {
        super(view);
        this.service = new StatusService();
    }
    public async loadMoreItems (authToken: AuthToken, userAlias: string) {
        try {
          const [newItems, hasMore] = await this.service.loadMoreStoryItems(
            authToken,
            userAlias,
            PAGE_SIZE,
            this.lastItem
          );
    
            this.hasMoreItems = hasMore;
            this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
            this.view.addItems(newItems);
        } catch (error) {
          this.view.displayErrorMessage(`Failed to load story items because of exception: ${error}`);
        }
      };
}