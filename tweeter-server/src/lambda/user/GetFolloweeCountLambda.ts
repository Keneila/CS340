// AI-assisted: see AI-ATTRIBUTION.md
import { GetCountRequest, GetCountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { FakeDAOFactory } from "../../model/dao/fake/FakeDAOFactory";

export const handler = async (
  request: GetCountRequest,
): Promise<GetCountResponse> => {
  const userService = new UserService(new FakeDAOFactory());
  const count = await userService.getFolloweeCount(
    request.token,
    request.userAlias,
  );
  return {
    success: true,
    message: null,
    count: count,
  };
};
