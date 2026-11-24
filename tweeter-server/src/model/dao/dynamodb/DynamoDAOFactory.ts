// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDAO } from "../AuthTokenDAO";
import { DAOFactory } from "../DAOFactory";
import { FeedDAO } from "../FeedDAO";
import { FollowDAO } from "../FollowDAO";
import { ImageDAO } from "../ImageDAO";
import { StoryDAO } from "../StoryDAO";
import { UserDAO } from "../UserDAO";
import {
  FakeAuthTokenDAO,
  FakeFeedDAO,
  FakeFollowDAO,
  FakeImageDAO,
  FakeStoryDAO,
  FakeUserDAO,
} from "../fake/FakeDAOFactory";

// Creates the DynamoDB (and S3) DAOs. Each DAO is created once and reused,
// since the DAOs hold no per-request state.
//
// TEMPORARY: until each Dynamo DAO is written, its getter returns the fake
// DAO instead, so the DAOs can be switched over one at a time. Replace each
// Fake* with the real class as it is written, then remove the fake import.
export class DynamoDAOFactory implements DAOFactory {
  private readonly userDAO: UserDAO = new FakeUserDAO(); // TODO: DynamoUserDAO
  private readonly authTokenDAO: AuthTokenDAO = new FakeAuthTokenDAO(); // TODO: DynamoAuthTokenDAO
  private readonly followDAO: FollowDAO = new FakeFollowDAO(); // TODO: DynamoFollowDAO
  private readonly storyDAO: StoryDAO = new FakeStoryDAO(); // TODO: DynamoStoryDAO
  private readonly feedDAO: FeedDAO = new FakeFeedDAO(); // TODO: DynamoFeedDAO
  private readonly imageDAO: ImageDAO = new FakeImageDAO(); // TODO: S3ImageDAO

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
