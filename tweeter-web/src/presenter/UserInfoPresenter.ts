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
    private userService: UserService;
    constructor(view: UserInfoView) {
        super(view);
        this.userService = new UserService();
    }

    public async unfollowDisplayedUserCode(displayedUser: User, authToken: AuthToken): Promise<void> {
        var unfollowingUserToast = "";

    try {
      this.view.setIsLoading(true);
      unfollowingUserToast = this.view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.unfollow(
        authToken!,
        displayedUser!
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to unfollow user because of exception: ${error}`);
    } finally {
      this.view.deleteMessage(unfollowingUserToast);
      this.view.setIsLoading(false);
    }
    }

    public async followDisplayedUserCode(displayedUser: User, authToken: AuthToken): Promise<void> {
        var followingUserToast = "";

    try {
      this.view.setIsLoading(true);
      followingUserToast = this.view.displayInfoMessage(
        `Following ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.follow(
        authToken!,
        displayedUser!
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to follow user because of exception: ${error}`);
    } finally {
      this.view.deleteMessage(followingUserToast);
      this.view.setIsLoading(false);
    }
    }


    public async setNumbFollowers (
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.view.setFollowerCount(await this.getFollowerCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get followers count because of exception: ${error}`);
    }
  };

  public async setNumbFollowees (
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get followees count because of exception: ${error}`);
    }
  };

    public async setIsFollowerStatus (
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to determine follower status because of exception: ${error}`);
    }
  };

  public getBaseUrl (): string {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };



    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
      ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        return await this.userService.getIsFollowerStatus(authToken, user, selectedUser);
      };
    
      public async getFolloweeCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        return await this.userService.getFolloweeCount(authToken, user);
      };
    
    public async getFollowerCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        // TODO: Replace with the result of calling server
        return await this.userService.getFollowerCount(authToken, user);
      };
    
    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the unfollow message. Remove when connected to the server
        
        return await this.userService.unfollow(authToken, userToUnfollow);
      };
    
      public async follow (
        authToken: AuthToken,
        userToFollow: User
      ): Promise<[followerCount: number, followeeCount: number]> {
        // Pause so we can see the follow message. Remove when connected to the server
        
        return await this.userService.follow(authToken, userToFollow);
      };


    
}