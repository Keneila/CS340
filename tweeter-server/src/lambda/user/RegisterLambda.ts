// AI-assisted: see AI-ATTRIBUTION.md
import { LoginResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: RegisterRequest,
): Promise<LoginResponse> => {
  const userService = new UserService();
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
