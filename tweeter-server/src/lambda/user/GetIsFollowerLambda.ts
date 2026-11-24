// AI-assisted: see AI-ATTRIBUTION.md
import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getDAOFactory } from "../DAOFactoryProvider";
import { withErrorHandling } from "../ErrorHandler";

const handleRequest = async (
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

export const handler = withErrorHandling(handleRequest);
