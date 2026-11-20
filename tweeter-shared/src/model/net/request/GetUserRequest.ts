// AI-assisted: see AI-ATTRIBUTION.md
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface GetUserRequest extends AuthenticatedRequest {
  readonly alias: string;
}
