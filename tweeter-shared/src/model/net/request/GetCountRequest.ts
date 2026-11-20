// AI-assisted: see AI-ATTRIBUTION.md
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface GetCountRequest extends AuthenticatedRequest {
  readonly userAlias: string;
}
