// AI-assisted: see AI-ATTRIBUTION.md
import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getDAOFactory } from "../DAOFactoryProvider";

export const handler = async (
  request: LogoutRequest,
): Promise<TweeterResponse> => {
  const userService = new UserService(getDAOFactory());
  await userService.logout(request.token);
  return {
    success: true,
    message: null,
  };
};
