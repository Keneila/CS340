// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { FeedDAO } from "../dao/FeedDAO";
import { StoryDAO } from "../dao/StoryDAO";
import { Service } from "./Service";

export class StatusService extends Service {
  private readonly storyDAO: StoryDAO;
  private readonly feedDAO: FeedDAO;

  public constructor(daoFactory: DAOFactory) {
    super(daoFactory);
    this.storyDAO = daoFactory.getStoryDAO();
    this.feedDAO = daoFactory.getFeedDAO();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    return this.feedDAO.getPageOfFeed(userAlias, pageSize, lastItem);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    return this.storyDAO.getPageOfStory(userAlias, pageSize, lastItem);
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.storyDAO.putStatus(newStatus);
    // TODO: Add the status to every follower's feed (FollowDAO follower pages + FeedDAO.putFeedItems)
  }
}
