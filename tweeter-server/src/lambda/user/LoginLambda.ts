// AI-assisted: see AI-ATTRIBUTION.md
import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getDAOFactory } from "../DAOFactoryProvider";

export const handler = async (
  request: LoginRequest,
): Promise<LoginResponse> => {
  const userService = new UserService(getDAOFactory());
  const [user, token] = await userService.login(
    request.alias,
    request.password,
  );
  return {
    success: true,
    message: null,
    user: user,
    token: token,
  };
};
