// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { createPagedItemHandler } from "../PagedItemHandler";

export const handler = createPagedItemHandler<StatusDto>(
  (token, userAlias, pageSize, lastItem) =>
    new StatusService().loadMoreFeedItems(token, userAlias, pageSize, lastItem),
);
