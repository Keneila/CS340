import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setFollowerCount: (count: number) => void;
  setFolloweeCount: (count: number) => void;
  setIsFollower: (isFollower: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private userService: UserService = new UserService();

  private async updateFollowCode(
    operation: (
      authToken: AuthToken,
      displayUser: User,
    ) => Promise<[followerCount: number, followeeCount: number]>,
    displayedUser: User,
    authToken: AuthToken,
    type: string,
    isFollower: boolean,
  ): Promise<void> {
    await this.doFailureReportingOperation(
      async (userToast) => {
        this.view.setIsLoading(true);
        userToast = this.view.displayInfoMessage(
          `${type}ing ${displayedUser!.name}...`,
          0,
        );

        const [followerCount, followeeCount] = await operation(
          authToken!,
          displayedUser!,
        );

        this.view.setIsFollower(isFollower);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
        return [userToast];
      },
      `${type} user`,
      (userToast) => {
        this.view.deleteMessage(userToast);
        this.view.setIsLoading(false);
      },
    );
  }

  public async unfollowDisplayedUserCode(
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> {
    await this.updateFollowCode(
      (authToken, displayedUser) => this.unfollow(authToken, displayedUser),
      displayedUser,
      authToken,
      "unfollow",
      false,
    );
  }

  public async followDisplayedUserCode(
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> {
    await this.updateFollowCode(
      (authToken, displayedUser) => this.follow(authToken, displayedUser),
      displayedUser,
      authToken,
      "follow",
      true,
    );
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.getFollowerCount(authToken, displayedUser),
      );
      return [""];
    }, "get followers count");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.getFolloweeCount(authToken, displayedUser),
      );
      return [""];
    }, "get followees count");
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!,
          ),
        );
      }
      return [""];
    }, "determine follower status");
  }

  public getBaseUrl(): string {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return await this.userService.getIsFollowerStatus(
      authToken,
      user,
      selectedUser,
    );
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return await this.userService.getFolloweeCount(authToken, user);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return await this.userService.getFollowerCount(authToken, user);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    return await this.userService.unfollow(authToken, userToUnfollow);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server

    return await this.userService.follow(authToken, userToFollow);
  }
}
