// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { FeedDAO } from "../dao/FeedDAO";
import { StoryDAO } from "../dao/StoryDAO";
import { AuthorizationService } from "./AuthorizationService";
import { Service } from "./Service";

export class StatusService extends Service {
  private readonly storyDAO: StoryDAO;
  private readonly feedDAO: FeedDAO;
  private readonly authorizationService: AuthorizationService;

  public constructor(daoFactory: DAOFactory) {
    super(daoFactory);
    this.storyDAO = daoFactory.getStoryDAO();
    this.feedDAO = daoFactory.getFeedDAO();
    this.authorizationService = new AuthorizationService(daoFactory);
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    await this.authorizationService.authenticate(token);
    return this.feedDAO.getPageOfFeed(userAlias, pageSize, lastItem);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    await this.authorizationService.authenticate(token);
    return this.storyDAO.getPageOfStory(userAlias, pageSize, lastItem);
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    // TODO: Once real auth tokens exist, throw "[unauthorized]" if the alias
    // authenticate returns differs from newStatus.user.alias
    await this.authorizationService.authenticate(token);
    await this.storyDAO.putStatus(newStatus);
    // TODO: Add the status to every follower's feed (FollowDAO follower pages + FeedDAO.putFeedItems)
  }
}
