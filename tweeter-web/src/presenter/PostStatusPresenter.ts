// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  post: string;
  setPost: (post: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService = new StatusService();

  public checkButtonStatus(authToken: AuthToken, currentUser: User) {
    return !this.view.post.trim() || !authToken || !currentUser;
  }
  public get statusService() {
    return this._statusService;
  }

  public async submitPostCode(authToken: AuthToken, currentUser: User) {
    await this.doFailureReportingOperation(
      async (postingStatusToastId) => {
        this.view.setIsLoading(true);
        postingStatusToastId = this.view.displayInfoMessage(
          "Posting status...",
          0,
        );

        const status = new Status(this.view.post, currentUser!, Date.now());

        await this.postStatus(authToken!, status);

        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
        return [postingStatusToastId];
      },
      "post the status",
      (postingStatusToastId) => {
        this.view.deleteMessage(postingStatusToastId);
        this.view.setIsLoading(false);
      },
    );
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    await this.statusService.postStatus(authToken, newStatus);
  }
}
