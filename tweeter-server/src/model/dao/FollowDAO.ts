// AI-assisted: see AI-ATTRIBUTION.md

// Stores follow relationships. Pages return aliases only; the service looks
// up the full users through UserDAO.
export interface FollowDAO {
  putFollow(followerAlias: string, followeeAlias: string): Promise<void>;

  deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;

  // Returns true if followerAlias follows followeeAlias.
  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;

  // Returns a page of the aliases that followerAlias follows, starting after
  // lastFolloweeAlias (or from the start if null), plus whether more remain.
  getPageOfFolloweeAliases(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null,
  ): Promise<[aliases: string[], hasMore: boolean]>;

  // Returns a page of the aliases that follow followeeAlias, starting after
  // lastFollowerAlias (or from the start if null), plus whether more remain.
  getPageOfFollowerAliases(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null,
  ): Promise<[aliases: string[], hasMore: boolean]>;
}
