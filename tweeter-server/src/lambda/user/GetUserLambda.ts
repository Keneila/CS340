// AI-assisted: see AI-ATTRIBUTION.md
import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getDAOFactory } from "../DAOFactoryProvider";
import { withErrorHandling } from "../ErrorHandler";

const handleRequest = async (
  request: GetUserRequest,
): Promise<GetUserResponse> => {
  const userService = new UserService(getDAOFactory());
  const user = await userService.getUser(request.token, request.alias);
  return {
    success: true,
    message: null,
    user: user,
  };
};

export const handler = withErrorHandling(handleRequest);
