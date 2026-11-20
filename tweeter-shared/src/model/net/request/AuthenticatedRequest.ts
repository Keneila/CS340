// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

export interface AuthenticatedRequest extends TweeterRequest {
  readonly token: string;
}
