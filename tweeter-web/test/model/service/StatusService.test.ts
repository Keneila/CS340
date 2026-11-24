/**
 * @jest-environment node
 */
// AI-assisted: see AI-ATTRIBUTION.md
// The docblock above must be the first thing in the file or Jest ignores it.
// Integration test: StatusService calls the deployed server through the real
// ServerFacade, which reads the DynamoDB tables. The node environment is used
// because jsdom has no fetch.
//
// It expects the tables to hold the data from tweeter-server's SeedData
// script: @allen (password "password") with more than 10 statuses in his
// story. Results are checked by their order and paging rather than a fixed
// list, so posting new statuses in the app does not break it.
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";
import { UserService } from "../../../src/model/service/UserService";

// Real server calls (cold starts, password hashing) can exceed Jest's 5s default.
jest.setTimeout(30_000);

const SEEDED_ALIAS = "@allen";
const SEEDED_PASSWORD = "password";
const PAGE_SIZE = 10;

describe("StatusService integration", () => {
  const statusService = new StatusService();
  const userService = new UserService();
  let user: User;
  let authToken: AuthToken;

  beforeAll(async () => {
    [user, authToken] = await userService.login(SEEDED_ALIAS, SEEDED_PASSWORD);
  });

  afterAll(async () => {
    await userService.logout(authToken);
  });

  it("successfully retrieves the first page of a user's story", async () => {
    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      SEEDED_ALIAS,
      PAGE_SIZE,
      null,
    );

    expect(statuses).toHaveLength(PAGE_SIZE);
    expect(hasMore).toBe(true);
    statuses.forEach((status) => {
      expect(status).toBeInstanceOf(Status);
      expect(status.user.dto).toEqual(user.dto);
      expect(typeof status.post).toBe("string");
    });

    // Newest first: each timestamp is earlier than the one before it.
    for (let i = 1; i < statuses.length; i++) {
      expect(statuses[i].timestamp).toBeLessThan(statuses[i - 1].timestamp);
    }
  });

  it("successfully retrieves the next page of a user's story after the given last item", async () => {
    const [firstPage] = await statusService.loadMoreStoryItems(
      authToken,
      SEEDED_ALIAS,
      PAGE_SIZE,
      null,
    );
    const lastItem = firstPage[firstPage.length - 1];

    const [statuses, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      SEEDED_ALIAS,
      PAGE_SIZE,
      lastItem,
    );

    expect(statuses.length).toBeGreaterThan(0);
    expect(statuses.length).toBeLessThanOrEqual(PAGE_SIZE);
    if (hasMore) {
      expect(statuses).toHaveLength(PAGE_SIZE);
    }
    statuses.forEach((status) => {
      expect(status).toBeInstanceOf(Status);
      expect(status.user.dto).toEqual(user.dto);
      expect(status.timestamp).toBeLessThan(lastItem.timestamp);
    });
    expect(
      statuses.some((s) => firstPage.some((first) => first.equals(s))),
    ).toBe(false);
  });
});
