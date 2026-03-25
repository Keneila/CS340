import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface PostStatusView {
    post : string;
    setPost: (post: string) => void;
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => string;
    deleteMessage: (messageId: string) => void;
    setIsLoading: (isLoading: boolean) => void;
}

export class PostStatusPresenter {
    private userService: UserService;
    private view: PostStatusView;
    constructor(view: PostStatusView) {
        this.userService = new UserService();
        this.view = view;
    }

    public checkButtonStatus (authToken: AuthToken, currentUser: User){
    return !this.view.post.trim() || !authToken || !currentUser;
  };

    public async submitPostCode(authToken: AuthToken, currentUser: User) {
        var postingStatusToastId = "";

    try {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage(
        "Posting status...",
        0
      );

      const status = new Status(this.view.post, currentUser!, Date.now());

      await this.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }
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