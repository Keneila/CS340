// AI-assisted: see AI-ATTRIBUTION.md
import { GetCountRequest, GetCountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { getDAOFactory } from "../DAOFactoryProvider";
import { withErrorHandling } from "../ErrorHandler";

const handleRequest = async (
  request: GetCountRequest,
): Promise<GetCountResponse> => {
  const userService = new UserService(getDAOFactory());
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

export const handler = withErrorHandling(handleRequest);
