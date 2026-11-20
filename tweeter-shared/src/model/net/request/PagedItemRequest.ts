// AI-assisted: see AI-ATTRIBUTION.md
import { AuthenticatedRequest } from "./AuthenticatedRequest";

export interface PagedItemRequest<T> extends AuthenticatedRequest {
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: T | null;
}
