import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UseNavigationView extends View {
  navigate: (url: string) => void;
  setDisplayedUser: (displayedUser: User) => void;
}
export class UseNavigationPresenter extends Presenter<UseNavigationView> {
  private userService = new UserService();

  public extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return await this.userService.getUser(authToken, alias);
  }

  public async navigateToUser(
    authToken: AuthToken,
    displayedUser: User,
    target: string,
  ) {
    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(target);

      const toUser = await this.getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          const featureUrl = target.split("/").at(-2);
          this.view.navigate(`/${featureUrl}/${toUser.alias}`);
        }
      }
      return [""];
    }, "get user");
  }
}
