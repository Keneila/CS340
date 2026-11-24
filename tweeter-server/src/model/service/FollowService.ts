// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { FollowDAO } from "../dao/FollowDAO";
import { UserDAO } from "../dao/UserDAO";
import { Service } from "./Service";

export class FollowService extends Service {
  private readonly followDAO: FollowDAO;
  private readonly userDAO: UserDAO;

  public constructor(daoFactory: DAOFactory) {
    super(daoFactory);
    this.followDAO = daoFactory.getFollowDAO();
    this.userDAO = daoFactory.getUserDAO();
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFollowee: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    return this.toUserPage(
      this.followDAO.getPageOfFolloweeAliases(
        userAlias,
        pageSize,
        lastFollowee?.alias ?? null,
      ),
    );
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFollower: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    return this.toUserPage(
      this.followDAO.getPageOfFollowerAliases(
        userAlias,
        pageSize,
        lastFollower?.alias ?? null,
      ),
    );
  }

  // Turns a page of aliases into a page of full users, keeping hasMore.
  private async toUserPage(
    aliasPage: Promise<[aliases: string[], hasMore: boolean]>,
  ): Promise<[UserDto[], boolean]> {
    const [aliases, hasMore] = await aliasPage;
    return [await this.userDAO.getUsers(aliases), hasMore];
  }
}
