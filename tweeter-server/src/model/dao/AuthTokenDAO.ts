// AI-assisted: see AI-ATTRIBUTION.md

// A stored session: which user owns the token and when it was last used.
export interface AuthTokenRecord {
  readonly token: string;
  readonly alias: string;
  readonly lastUsed: number;
}

// Stores auth tokens so sessions can be validated, refreshed, and expired.
export interface AuthTokenDAO {
  // Saves a new token for this alias with lastUsed set to timestamp.
  putAuthToken(token: string, alias: string, timestamp: number): Promise<void>;

  // Returns the stored token record, or null if the token does not exist.
  getAuthToken(token: string): Promise<AuthTokenRecord | null>;

  // Records activity on the token so it does not expire.
  updateLastUsed(token: string, timestamp: number): Promise<void>;

  // Removes the token (logout or expiry).
  deleteAuthToken(token: string): Promise<void>;
}
