// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterResponse } from "./TweeterResponse";

export interface PagedItemResponse<T> extends TweeterResponse {
  readonly items: T[] | null;
  readonly hasMore: boolean;
}
