// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";

// Stores each user's own statuses (their story).
export interface StoryDAO {
  // Saves a status to its author's story.
  putStatus(status: StatusDto): Promise<void>;

  // Returns a page of authorAlias's statuses, newest first, starting after
  // lastItem (or from the newest if null), plus whether more remain.
  getPageOfStory(
    authorAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[statuses: StatusDto[], hasMore: boolean]>;
}
