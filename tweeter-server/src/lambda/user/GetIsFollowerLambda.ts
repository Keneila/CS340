// AI-assisted: see AI-ATTRIBUTION.md
import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { FakeDAOFactory } from "../../model/dao/fake/FakeDAOFactory";

export const handler = async (
  request: IsFollowerRequest,
): Promise<IsFollowerResponse> => {
  const userService = new UserService(new FakeDAOFactory());
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
