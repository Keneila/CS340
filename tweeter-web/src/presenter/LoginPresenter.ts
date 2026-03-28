import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LoginView {
    navigate: (url: string) => void;
    displayErrorMessage: (message: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    updateUserInfo: (currentUser: User,
      displayedUser: User | null,
      authToken: AuthToken,
      remember: boolean)    => void;
}


export class LoginPresenter {
    private view: LoginView;
    private userService: UserService;
    constructor(view: LoginView) {
        this.view = view;
        this.userService = new UserService();
    }
    

    public async doLogin (alias: string, password: string, rememberMe: boolean, originalUrl: string): Promise<void> {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to log user in because of exception: ${error}`);
    } finally {
      this.view.setIsLoading(false);
    }
  };

  public checkSubmitButtonStatus (alias: string, password: string): boolean {
    return !alias || !password;
  };

    public async login(
          alias: string,
          password: string
        ): Promise<[User, AuthToken]> {
        // TODO: Replace with the result of calling the server

          return await this.userService.login(alias, password);
      };
    


    
}