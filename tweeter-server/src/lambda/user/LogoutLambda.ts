// AI-assisted: see AI-ATTRIBUTION.md
import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { FakeDAOFactory } from "../../model/dao/fake/FakeDAOFactory";

export const handler = async (
  request: LogoutRequest,
): Promise<TweeterResponse> => {
  const userService = new UserService(new FakeDAOFactory());
  await userService.logout(request.token);
  return {
    success: true,
    message: null,
  };
};
