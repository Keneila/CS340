// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

export interface LogoutRequest extends TweeterRequest {
  readonly token: string;
}
