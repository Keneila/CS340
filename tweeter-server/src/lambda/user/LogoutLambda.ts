// AI-assisted: see AI-ATTRIBUTION.md
import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getDAOFactory } from "../DAOFactoryProvider";
import { withErrorHandling } from "../ErrorHandler";

const handleRequest = async (
  request: LogoutRequest,
): Promise<TweeterResponse> => {
  const userService = new UserService(getDAOFactory());
  await userService.logout(request.token);
  return {
    success: true,
    message: null,
  };
};

export const handler = withErrorHandling(handleRequest);
