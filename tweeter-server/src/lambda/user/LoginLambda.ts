// AI-assisted: see AI-ATTRIBUTION.md
import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { FakeDAOFactory } from "../../model/dao/fake/FakeDAOFactory";

export const handler = async (
  request: LoginRequest,
): Promise<LoginResponse> => {
  const userService = new UserService(new FakeDAOFactory());
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
