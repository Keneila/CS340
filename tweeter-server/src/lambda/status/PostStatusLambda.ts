// AI-assisted: see AI-ATTRIBUTION.md
import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { getDAOFactory } from "../DAOFactoryProvider";

export const handler = async (
  request: PostStatusRequest,
): Promise<TweeterResponse> => {
  const statusService = new StatusService(getDAOFactory());
  await statusService.postStatus(request.token, request.newStatus);
  return {
    success: true,
    message: null,
  };
};
