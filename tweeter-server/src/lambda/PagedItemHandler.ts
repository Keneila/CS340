// AI-assisted: see AI-ATTRIBUTION.md
import { PagedItemRequest, PagedItemResponse } from "tweeter-shared";

export type LoadMoreItems<T> = (
  token: string,
  userAlias: string,
  pageSize: number,
  lastItem: T | null,
) => Promise<[T[], boolean]>;

// Builds a Lambda handler that loads one page of items and wraps it in a
// successful paged response. Each paged lambda only supplies how to load.
export const createPagedItemHandler = <T>(loadMore: LoadMoreItems<T>) => {
  return async (
    request: PagedItemRequest<T>,
  ): Promise<PagedItemResponse<T>> => {
    const [items, hasMore] = await loadMore(
      request.token,
      request.userAlias,
      request.pageSize,
      request.lastItem,
    );
    return {
      success: true,
      message: null,
      items: items,
      hasMore: hasMore,
    };
  };
};
