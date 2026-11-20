// AI-assisted: see AI-ATTRIBUTION.md
import { FollowResponse, GetCountRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: GetCountRequest,
): Promise<FollowResponse> => {
  const userService = new UserService();
  const [followerCount, followeeCount] = await userService.unfollow(
    request.token,
    request.userAlias,
  );
  return {
    success: true,
    message: null,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
