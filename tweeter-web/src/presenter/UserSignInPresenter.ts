import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model.service/UserService";

export interface UserSignInView extends View {
  navigate: (url: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
}

export abstract class UserSignInPresenter<
  T extends UserSignInView,
> extends Presenter<T> {
  private _userService = new UserService();
  protected get userService() {
    return this._userService;
  }
  public abstract checkSubmitButtonStatus(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageUrl?: string,
    imageFileExtension?: string,
  ): boolean;
  protected abstract signInDescription(): string;
  protected abstract signIn(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string,
  ): Promise<[User, AuthToken]>;

  public async doSignIn(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string,
  ): Promise<void> {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        const [user, authToken] = await this.signIn(
          alias,
          password,
          firstName,
          lastName,
          imageBytes,
          imageFileExtension,
        );
        this.view.updateUserInfo(user, user, authToken, rememberMe);
        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      },
      this.signInDescription(),
      () => this.view.setIsLoading(false),
    );
  }
}
