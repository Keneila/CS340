import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LogoutView {
    navigate: (url: string) => void;
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => string;
    deleteMessage: (messageId: string) => void;
    clearUserInfo: () => void;
}


export class LogoutPresenter {
    private view: LogoutView;
    private userService: UserService;
    constructor(view: LogoutView) {
        this.view = view;
        this.userService = new UserService();
    }

    public async logOut (authToken: AuthToken): Promise<void> {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user out because of exception: ${error}`);
    }
  };

  public async logout (authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    this.userService.logout(authToken);
  };


}