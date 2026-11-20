// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterResponse } from "./TweeterResponse";

export interface IsFollowerResponse extends TweeterResponse {
  readonly isFollower: boolean;
}
