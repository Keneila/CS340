// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { getDAOFactory } from "../DAOFactoryProvider";
import { createPagedItemHandler } from "../PagedItemHandler";

export const handler = createPagedItemHandler<UserDto>(
  (token, userAlias, pageSize, lastItem) =>
    new FollowService(getDAOFactory()).loadMoreFollowees(
      token,
      userAlias,
      pageSize,
      lastItem,
    ),
);
