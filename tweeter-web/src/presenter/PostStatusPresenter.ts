import { AuthToken, Status } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface PostStatusView {
    
}

export class PostStatusPresenter {
    private _view: PostStatusView;
    private userService: UserService;
    constructor(view: PostStatusView) {
        this._view = view;
        this.userService = new UserService();
    }
    protected get view() {
        return this._view;
    }

    public async postStatus (
          authToken: AuthToken,
          newStatus: Status
        ): Promise<void> {
          // Pause so we can see the logging out message. Remove when connected to the server
          this.userService.postStatus(authToken, newStatus);
      
          // TODO: Call the server to post the status
        };
}