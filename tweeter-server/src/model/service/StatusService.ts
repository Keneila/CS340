// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { FeedDAO } from "../dao/FeedDAO";
import { FollowDAO } from "../dao/FollowDAO";
import { StoryDAO } from "../dao/StoryDAO";
import { AuthorizationService } from "./AuthorizationService";
import { Service } from "./Service";

// How many followers to load per page while adding a new status to feeds.
const FOLLOWER_PAGE_SIZE = 25;

export class StatusService extends Service {
  private readonly storyDAO: StoryDAO;
  private readonly feedDAO: FeedDAO;
  private readonly followDAO: FollowDAO;
  private readonly authorizationService: AuthorizationService;

  public constructor(daoFactory: DAOFactory) {
    super(daoFactory);
    this.storyDAO = daoFactory.getStoryDAO();
    this.feedDAO = daoFactory.getFeedDAO();
    this.followDAO = daoFactory.getFollowDAO();
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
    // Users may only post as themselves: the status's author must be the
    // user the token belongs to.
    const currentAlias = await this.authorizationService.authenticate(token);
    if (newStatus.user.alias !== currentAlias) {
      throw new Error("[unauthorized] You can only post statuses as yourself");
    }

    await this.storyDAO.putStatus(newStatus);
    await this.addToFollowerFeeds(newStatus);
  }

  // Adds the status to the feed of every follower of its author, loading the
  // followers one page at a time so large follower lists are never held at once.
  private async addToFollowerFeeds(status: StatusDto): Promise<void> {
    let lastFollowerAlias: string | null = null;
    let hasMore = true;

    while (hasMore) {
      const [followerAliases, morePages]: [string[], boolean] =
        await this.followDAO.getPageOfFollowerAliases(
          status.user.alias,
          FOLLOWER_PAGE_SIZE,
          lastFollowerAlias,
        );

      if (followerAliases.length > 0) {
        await this.feedDAO.putFeedItems(followerAliases, status);
        lastFollowerAlias = followerAliases[followerAliases.length - 1];
      }

      // Also stop on an empty page so a bad hasMore flag can't loop forever.
      hasMore = morePages && followerAliases.length > 0;
    }
  }
}
