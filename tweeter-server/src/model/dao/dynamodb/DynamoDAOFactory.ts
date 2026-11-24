// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDAO } from "../AuthTokenDAO";
import { DAOFactory } from "../DAOFactory";
import { FeedDAO } from "../FeedDAO";
import { FollowDAO } from "../FollowDAO";
import { ImageDAO } from "../ImageDAO";
import { StoryDAO } from "../StoryDAO";
import { UserDAO } from "../UserDAO";
import { S3ImageDAO } from "../s3/S3ImageDAO";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { DynamoFeedDAO } from "./DynamoFeedDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoStoryDAO } from "./DynamoStoryDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";

// Creates the DynamoDB DAOs, plus the S3 DAO for profile images. Each DAO is
// created once and reused, since the DAOs hold no per-request state.
export class DynamoDAOFactory implements DAOFactory {
  private readonly userDAO: UserDAO = new DynamoUserDAO();
  private readonly authTokenDAO: AuthTokenDAO = new DynamoAuthTokenDAO();
  private readonly followDAO: FollowDAO = new DynamoFollowDAO();
  // Story and feed items store only author aliases, so these DAOs get the
  // user DAO to look authors up. userDAO must stay declared above them.
  private readonly storyDAO: StoryDAO = new DynamoStoryDAO(this.userDAO);
  private readonly feedDAO: FeedDAO = new DynamoFeedDAO(this.userDAO);
  private readonly imageDAO: ImageDAO = new S3ImageDAO();

  public getUserDAO(): UserDAO {
    return this.userDAO;
  }

  public getAuthTokenDAO(): AuthTokenDAO {
    return this.authTokenDAO;
  }

  public getFollowDAO(): FollowDAO {
    return this.followDAO;
  }

  public getStoryDAO(): StoryDAO {
    return this.storyDAO;
  }

  public getFeedDAO(): FeedDAO {
    return this.feedDAO;
  }

  public getImageDAO(): ImageDAO {
    return this.imageDAO;
  }
}
