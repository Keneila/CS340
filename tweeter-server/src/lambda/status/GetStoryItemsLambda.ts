// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { FakeDAOFactory } from "../../model/dao/fake/FakeDAOFactory";
import { createPagedItemHandler } from "../PagedItemHandler";

export const handler = createPagedItemHandler<StatusDto>(
  (token, userAlias, pageSize, lastItem) =>
    new StatusService(new FakeDAOFactory()).loadMoreStoryItems(
      token,
      userAlias,
      pageSize,
      lastItem,
    ),
);
