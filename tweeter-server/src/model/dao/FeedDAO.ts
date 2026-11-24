// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";

// Stores each user's precomputed feed (statuses from the users they follow).
export interface FeedDAO {
  // Adds the status to the feed of every receiver alias.
  putFeedItems(receiverAliases: string[], status: StatusDto): Promise<void>;

  // Returns a page of receiverAlias's feed, newest first, starting after
  // lastItem (or from the newest if null), plus whether more remain.
  getPageOfFeed(
    receiverAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[statuses: StatusDto[], hasMore: boolean]>;
}
