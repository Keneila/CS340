// AI-assisted: see AI-ATTRIBUTION.md
import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getDAOFactory } from "../DAOFactoryProvider";

export const handler = async (
  request: IsFollowerRequest,
): Promise<IsFollowerResponse> => {
  const userService = new UserService(getDAOFactory());
  const isFollower = await userService.getIsFollowerStatus(
    request.token,
    request.userAlias,
    request.selectedUserAlias,
  );
  return {
    success: true,
    message: null,
    isFollower: isFollower,
  };
};
