// AI-assisted: see AI-ATTRIBUTION.md
import { GetCountRequest, GetCountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getDAOFactory } from "../DAOFactoryProvider";

export const handler = async (
  request: GetCountRequest,
): Promise<GetCountResponse> => {
  const userService = new UserService(getDAOFactory());
  const count = await userService.getFollowerCount(
    request.token,
    request.userAlias,
  );
  return {
    success: true,
    message: null,
    count: count,
  };
};
