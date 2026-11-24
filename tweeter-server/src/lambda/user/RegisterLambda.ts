// AI-assisted: see AI-ATTRIBUTION.md
import { LoginResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getDAOFactory } from "../DAOFactoryProvider";
import { withErrorHandling } from "../ErrorHandler";

const handleRequest = async (
  request: RegisterRequest,
): Promise<LoginResponse> => {
  const userService = new UserService(getDAOFactory());
  const [user, token] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension,
  );
  return {
    success: true,
    message: null,
    user: user,
    token: token,
  };
};

export const handler = withErrorHandling(handleRequest);
