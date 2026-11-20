// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

export interface GetCountRequest extends TweeterRequest {
  readonly token: string;
  readonly userAlias: string;
}
