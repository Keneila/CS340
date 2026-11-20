/**
 * @jest-environment node
 */
// AI-assisted: see AI-ATTRIBUTION.md
// The docblock above must be the first thing in the file or Jest ignores it.
// Integration test: StatusService calls the deployed server through the real
// ServerFacade. The node environment is used because jsdom has no fetch.
// Expected values assume the server is still returning FakeData.
import { AuthToken, FakeData, Status } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";

describe("StatusService integration", () => {
  let statusService: StatusService;
  const authToken = new AuthToken("test-token", Date.now());

  beforeEach(() => {
    statusService = new StatusService();
  });

  it("successfully retrieves the first page of a user's story", async () => {
    const pageSize = 10;
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      "@allen",
      pageSize,
      null,
    );

    const [expectedStatuses, expectedHasMore] =
      FakeData.instance.getPageOfStatuses(null, pageSize);

    expect(statuses).toHaveLength(pageSize);
    expect(hasMore).toBe(expectedHasMore);
    expect(hasMore).toBe(true);
    statuses.forEach((status) => expect(status).toBeInstanceOf(Status));
    expect(statuses.map((s) => s.dto)).toEqual(
      expectedStatuses.map((s) => s.dto),
    );
    statuses.forEach((status, i) =>
      expect(status.equals(expectedStatuses[i])).toBe(true),
    );
    expect(statuses[0].user.alias).toBe("@allen");
    expect(statuses[0].post).toContain("Post 0 0");
  });

  it("successfully retrieves the next page of a user's story after the given last item", async () => {
    const pageSize = 10;
    const [firstPage] = FakeData.instance.getPageOfStatuses(null, pageSize);
    const lastItem = firstPage[firstPage.length - 1];

    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      "@allen",
      pageSize,
      lastItem,
    );

    const [expectedStatuses, expectedHasMore] =
      FakeData.instance.getPageOfStatuses(lastItem, pageSize);

    expect(statuses).toHaveLength(expectedStatuses.length);
    expect(hasMore).toBe(expectedHasMore);
    expect(statuses.map((s) => s.dto)).toEqual(
      expectedStatuses.map((s) => s.dto),
    );
    expect(statuses.some((s) => s.equals(lastItem))).toBe(false);
  });
});
