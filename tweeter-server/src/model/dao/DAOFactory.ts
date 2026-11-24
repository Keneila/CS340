// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDAO } from "./AuthTokenDAO";
import { FeedDAO } from "./FeedDAO";
import { FollowDAO } from "./FollowDAO";
import { ImageDAO } from "./ImageDAO";
import { StoryDAO } from "./StoryDAO";
import { UserDAO } from "./UserDAO";

// Abstract factory: services ask this for DAOs instead of calling `new`, so
// they never know which database backs them.
export interface DAOFactory {
  getUserDAO(): UserDAO;
  getAuthTokenDAO(): AuthTokenDAO;
  getFollowDAO(): FollowDAO;
  getStoryDAO(): StoryDAO;
  getFeedDAO(): FeedDAO;
  getImageDAO(): ImageDAO;
}
