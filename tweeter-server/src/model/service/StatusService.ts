// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService implements Service {
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling the database
    return this.getFakeData(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling the database
    return this.getFakeData(lastItem, pageSize);
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    // TODO: Save the status to the database
  }

  private async getFakeData(
    lastItem: StatusDto | null,
    pageSize: number,
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize,
    );
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }
}
