// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { FakeDAOFactory } from "../../model/dao/fake/FakeDAOFactory";
import { createPagedItemHandler } from "../PagedItemHandler";

export const handler = createPagedItemHandler<UserDto>(
  (token, userAlias, pageSize, lastItem) =>
    new FollowService(new FakeDAOFactory()).loadMoreFollowees(
      token,
      userAlias,
      pageSize,
      lastItem,
    ),
);
