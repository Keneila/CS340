// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";

// Stores user profiles, password hashes, and precomputed follow counts.
export interface UserDAO {
  // Saves a new user with its hashed password and both follow counts set to 0.
  putUser(user: UserDto, passwordHash: string): Promise<void>;

  // Returns the user with this alias, or null if none exists.
  getUser(alias: string): Promise<UserDto | null>;

  // Returns the users for these aliases. Unknown aliases are skipped.
  getUsers(aliases: string[]): Promise<UserDto[]>;

  // Returns the stored password hash for this alias, or null if none exists.
  getPasswordHash(alias: string): Promise<string | null>;

  getFollowerCount(alias: string): Promise<number>;

  getFolloweeCount(alias: string): Promise<number>;

  // Adds delta (e.g. +1 on follow, -1 on unfollow) to the user's follower count.
  changeFollowerCount(alias: string, delta: number): Promise<void>;

  // Adds delta (e.g. +1 on follow, -1 on unfollow) to the user's followee count.
  changeFolloweeCount(alias: string, delta: number): Promise<void>;
}
