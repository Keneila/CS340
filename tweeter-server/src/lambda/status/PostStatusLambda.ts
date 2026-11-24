// AI-assisted: see AI-ATTRIBUTION.md
import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { getDAOFactory } from "../DAOFactoryProvider";
import { withErrorHandling } from "../ErrorHandler";

const handleRequest = async (
  request: PostStatusRequest,
): Promise<TweeterResponse> => {
  const statusService = new StatusService(getDAOFactory());
  await statusService.postStatus(request.token, request.newStatus);
  return {
    success: true,
    message: null,
  };
};

export const handler = withErrorHandling(handleRequest);
