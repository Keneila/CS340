import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { UserSignInPresenter, UserSignInView } from "./UserSignInPresenter";

export class LoginPresenter extends UserSignInPresenter<UserSignInView> {
  public checkSubmitButtonStatus(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageUrl?: string,
    imageFileExtension?: string,
  ): boolean {
    return !alias || !password;
  }

  protected signInDescription(): string {
    return "log user in";
  }
  protected async signIn(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string,
  ): Promise<[User, AuthToken]> {
    return await this.userService.login(alias, password);
  }
}
