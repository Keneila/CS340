/**
 * @jest-environment node
 */
// AI-assisted: see AI-ATTRIBUTION.md
// The docblock above must be the first thing in the file or Jest ignores it.
// Integration tests: these call the deployed server through the real
// ServerFacade. The node environment is used because jsdom has no fetch.
// Expected values assume the server is still returning FakeData.
import { AuthToken, FakeData, User } from "tweeter-shared";
import { ServerFacade } from "../../../src/model/net/ServerFacade";

describe("ServerFacade integration", () => {
  let serverFacade: ServerFacade;
  const token = "test-token";

  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  describe("register", () => {
    it("returns Allen Anderson and a valid auth token", async () => {
      const [user, authToken] = await serverFacade.register({
        firstName: "Test",
        lastName: "User",
        alias: "@testuser",
        password: "password",
        userImageBytes: "aGVsbG8gd29ybGQ=",
        imageFileExtension: "png",
      });

      const expectedUser = FakeData.instance.firstUser as User;

      expect(user).toBeInstanceOf(User);
      expect(user.firstName).toBe("Allen");
      expect(user.lastName).toBe("Anderson");
      expect(user.alias).toBe("@allen");
      expect(user.imageUrl).toBe(expectedUser.imageUrl);
      expect(user.equals(expectedUser)).toBe(true);

      expect(authToken).toBeInstanceOf(AuthToken);
      expect(typeof authToken.token).toBe("string");
      expect(authToken.token.length).toBeGreaterThan(0);
    });
  });

  describe("getMoreFollowers", () => {
    it("returns the first page of followers, omitting the requested user", async () => {
      const pageSize = 10;
      const [followers, hasMore] = await serverFacade.getMoreFollowers({
        token: token,
        userAlias: "@allen",
        pageSize: pageSize,
        lastItem: null,
      });

      const [expectedFollowers, expectedHasMore] =
        FakeData.instance.getPageOfUsers(null, pageSize, "@allen");

      expect(followers).toHaveLength(pageSize);
      expect(hasMore).toBe(expectedHasMore);
      expect(hasMore).toBe(true);
      followers.forEach((follower) => expect(follower).toBeInstanceOf(User));
      expect(followers.map((f) => f.dto)).toEqual(
        expectedFollowers.map((f) => f.dto),
      );
      expect(followers.some((f) => f.alias === "@allen")).toBe(false);
      expect(followers[0].alias).toBe("@amy");
    });

    it("returns the next page of followers after the given last item", async () => {
      const pageSize = 10;
      const [firstPage] = FakeData.instance.getPageOfUsers(
        null,
        pageSize,
        "@allen",
      );
      const lastItem = firstPage[firstPage.length - 1];

      const [followers, hasMore] = await serverFacade.getMoreFollowers({
        token: token,
        userAlias: "@allen",
        pageSize: pageSize,
        lastItem: lastItem.dto,
      });

      const [expectedFollowers, expectedHasMore] =
        FakeData.instance.getPageOfUsers(lastItem, pageSize, "@allen");

      expect(followers.map((f) => f.dto)).toEqual(
        expectedFollowers.map((f) => f.dto),
      );
      expect(hasMore).toBe(expectedHasMore);
      expect(followers.some((f) => f.equals(lastItem))).toBe(false);
    });
  });

  describe("getFollowerCount", () => {
    it("returns a follower count between 1 and 10", async () => {
      const count = await serverFacade.getFollowerCount({
        token: token,
        userAlias: "@allen",
      });

      expect(Number.isInteger(count)).toBe(true);
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThanOrEqual(10);
    });
  });

  describe("getFolloweeCount", () => {
    it("returns a followee count between 1 and 10", async () => {
      const count = await serverFacade.getFolloweeCount({
        token: token,
        userAlias: "@allen",
      });

      expect(Number.isInteger(count)).toBe(true);
      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThanOrEqual(10);
    });
  });
});
