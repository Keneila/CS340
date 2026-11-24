## 2026-11-19: tweeter-server/template.yaml

- Tool: Claude Code (Claude Opus 5.5)
- Task: Add the getFolloweesLambda function and the /followees API endpoint to template.yaml so SAM can deploy them, following the file's existing conventions without changing existing code.
- Review: The two new additions to template.yaml work, and I didn't change anything

## 2026-11-20: tweeter-server/template.yaml, tweeter-web/src/model/net/ServerFacade.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Set up API Gateway and client communication for the new GetFollowersLambda by adding a /followers endpoint and getFollowersLambda function to template.yaml and a getMoreFollowers method to ServerFacade, following the getFollowees pattern.
- Review: Looked at all of the new code, while its repetative compared to followees, it works. No current changed needed.

## 2026-11-20: tweeter-shared/src/model/dto/StatusDto.ts, tweeter-shared/src/model/net/request/PagedStatusItemRequest.ts, tweeter-shared/src/model/net/response/PagedStatusItemResponse.ts, tweeter-shared/src/index.ts, tweeter-shared/src/model/domain/Status.ts, tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/lambda/status/GetFeedItemsLambda.ts, tweeter-server/template.yaml, tweeter-web/src/model/net/ServerFacade.ts, tweeter-web/src/model/service/StatusService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create a working GetFeedItemsLambda following the getFollowers/getFollowees pattern, filling in StatusDto, PagedStatusItemRequest/Response, the server StatusService, the lambda, and a getMoreFeedItems ServerFacade method, plus the approved supporting changes (index.ts exports, Status dto/fromDto, /feed in template.yaml, web StatusService calling the server).
- Review: Looked at all of the new code, while its repetative compared to the pageduseritems, it works. No current changed needed.

## 2026-11-20: tweeter-server/src/lambda/status/GetStoryItemsLambda.ts (new file), tweeter-server/template.yaml, tweeter-web/src/model/net/ServerFacade.ts, tweeter-web/src/model/service/StatusService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create a working GetStoryItemsLambda the same way as GetFeedItemsLambda: the lambda, a /story endpoint and function in template.yaml, a getMoreStoryItems ServerFacade method, and the web StatusService calling the server for story items.
- Review: Looked at all of the new code, while its repetative compared to the the other three, it works. No current changed needed.

## 2026-11-20: tweeter-server/src/lambda/user/LoginLambda.ts (new file), tweeter-shared/src/model/net/request/LoginRequest.ts (new file), tweeter-shared/src/model/net/response/LoginResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/model/net/ServerFacade.ts, tweeter-web/src/model/service/UserService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create a LoginLambda in lambda/user following the follow/status lambda pattern (LoginRequest/LoginResponse interfaces, /login in template.yaml, a ServerFacade login method), and make a shared getFakeData method in the server UserService used by both login and register. Approved supporting changes: index.ts exports, token sent as a string, and web UserService.login calling the server.
- Review: I checked all the new files and changes. Only thing of not is the changed error message added to getFakeData, and the name of getFakeData in UserService. I fixed the name, but left the error message as I'm not sure how much it matters.

## 2026-11-20: tweeter-server/src/lambda/user/RegisterLambda.ts (new file), tweeter-shared/src/model/net/request/RegisterRequest.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/model/net/ServerFacade.ts, tweeter-web/src/model/service/UserService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create a RegisterLambda following the LoginLambda pattern, and update template.yaml, ServerFacade, and the server UserService for it. Approved supporting changes: a new RegisterRequest (reusing LoginResponse), the index.ts export, and web UserService.register calling the server with the image as a base64 string.
- Review: All the new files look good, nothing unexpected.

## 2026-11-20: tweeter-server/src/lambda/user/GetUserLambda.ts (new file), tweeter-shared/src/model/net/request/GetUserRequest.ts (new file), tweeter-shared/src/model/net/response/GetUserResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/model/net/ServerFacade.ts, tweeter-web/src/model/service/UserService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create a GetUserLambda following the LoginLambda/RegisterLambda pattern. Approved supporting changes: new GetUserRequest and GetUserResponse with index.ts exports, a /getuser endpoint in template.yaml, a ServerFacade getUser method, the server UserService.getUser taking a token string and returning a UserDto, and the web UserService.getUser calling the server.
- Review: All the new code looks good. Nothing unexpected.

## 2026-11-20: tweeter-server/src/lambda/user/LogoutLambda.ts (new file), tweeter-shared/src/model/net/request/LogoutRequest.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/model/net/ServerFacade.ts, tweeter-web/src/model/service/UserService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create a LogoutLambda following the same pattern as the other user lambdas. Approved supporting changes: a new LogoutRequest (reusing TweeterResponse) with an index.ts export, a /logout endpoint in template.yaml, a ServerFacade logout method, the server UserService.logout taking a token string, and the web UserService.logout calling the server.
- Review: New code lookes good. There's nothing unexpected.

## 2026-11-20: tweeter-server/src/lambda/user/GetIsFollowerLambda.ts (new file), tweeter-shared/src/model/net/request/IsFollowerRequest.ts (new file), tweeter-shared/src/model/net/response/IsFollowerResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/model/net/ServerFacade.ts, tweeter-web/src/model/service/UserService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create a GetIsFollowerLambda following the same pattern as the other user lambdas. Approved supporting changes: new IsFollowerRequest and IsFollowerResponse with index.ts exports, a /isfollower endpoint in template.yaml, a ServerFacade isFollower method, the server UserService.getIsFollowerStatus taking a token string and aliases, and the web UserService.getIsFollowerStatus calling the server.
- Review: New code lookes good. There's nothing unexpected.

## 2026-11-20: tweeter-server/src/lambda/user/GetFolloweeCountLambda.ts (new file), tweeter-shared/src/model/net/request/GetCountRequest.ts (new file), tweeter-shared/src/model/net/response/GetCountResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/model/net/ServerFacade.ts, tweeter-web/src/model/service/UserService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create a GetFolloweeCountLambda in the same pattern as GetIsFollowerLambda: new GetCountRequest and GetCountResponse with index.ts exports, a /followeecount endpoint in template.yaml, a ServerFacade getFolloweeCount method, the server UserService.getFolloweeCount taking a token string and alias (with its follow/unfollow callers updated to match), and the web UserService.getFolloweeCount calling the server.
- Review: New code lookes good. There's nothing unexpected.

## 2026-11-20: tweeter-server/src/lambda/user/GetFollowerCountLambda.ts (new file), tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/model/net/ServerFacade.ts, tweeter-web/src/model/service/UserService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create a GetFollowerCountLambda in the same pattern as GetFolloweeCountLambda: reuse GetCountRequest/GetCountResponse, add a /followercount endpoint in template.yaml, a ServerFacade getFollowerCount method, the server UserService.getFollowerCount taking a token string and alias (with its follow/unfollow callers updated to match), and the web UserService.getFollowerCount calling the server (removing its now-unused FakeData import).
- Review: New code lookes good. There's nothing unexpected.

## 2026-11-20: tweeter-server/src/lambda/user/FollowLambda.ts (new file), tweeter-shared/src/model/net/response/FollowResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/model/net/ServerFacade.ts, tweeter-web/src/model/service/UserService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create a FollowLambda following the same pattern as the other user lambdas. Approved supporting changes: reuse GetCountRequest as the request, a new FollowResponse (followerCount and followeeCount) with an index.ts export, a /follow endpoint in template.yaml, a ServerFacade follow method, the server UserService.follow taking a token string and alias, and the web UserService.follow calling the server.
- Review: New code lookes good. There's nothing unexpected.

## 2026-11-20: tweeter-server/src/lambda/user/UnfollowLambda.ts (new file), tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/model/net/ServerFacade.ts, tweeter-web/src/model/service/UserService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create an UnfollowLambda following the same pattern as FollowLambda: reuse GetCountRequest and FollowResponse, add an /unfollow endpoint and unfollowLambda function in template.yaml, a ServerFacade unfollow method, the server UserService.unfollow taking a token string and alias (removing the now-unused User import), and the web UserService.unfollow calling the server.
- Review: New code lookes good. There's nothing unexpected.

## 2026-11-20: tweeter-server/src/lambda/status/PostStatusLambda.ts (new file), tweeter-shared/src/model/net/request/PostStatusRequest.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, tweeter-web/src/model/net/ServerFacade.ts, tweeter-web/src/model/service/StatusService.ts, tweeter-web/src/model/service/UserService.ts, tweeter-web/src/presenter/PostStatusPresenter.ts, tweeter-web/test/presenter/PostStatusPresenter.test.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create a PostStatusLambda following the same pattern as the other lambdas. Approved supporting changes: a new PostStatusRequest (token and StatusDto, reusing TweeterResponse) with an index.ts export, a /poststatus endpoint in template.yaml, a ServerFacade postStatus method, moving postStatus from UserService to StatusService on both server and web (removing now-unused imports), and updating PostStatusPresenter and its test to use StatusService.
- Review: New code lookes good. There's nothing unexpected. I asked it to put PostStatus is the statusservice, instead of user service

## 2026-11-20: tweeter-web/test/model/net/ServerFacade.test.ts (new file), tweeter-web/test/model/service/StatusService.test.ts (new file)

- Tool: Claude Code (Claude Opus 5.5)
- Task: Write Jest integration tests that call the client ServerFacade against the deployed server (Register, GetFollowers, GetFollowerCount/GetFolloweeCount), and an integration test for StatusService's story retrieval. The tests check results against FakeData.
- Review: I reviewed the tests to check if they're actually testing what they say they're testing. Everything looks fine.

## 2026-11-20: tweeter-web/test/model/net/ServerFacade.test.ts, tweeter-web/test/model/service/StatusService.test.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Fix "fetch is not defined" in the new integration tests by moving the `@jest-environment node` docblock above the AI-assisted line, since Jest only reads it when it is first in the file (approved exception to the first-line rule).
- Review: just minor fix, everything looks fine.

## 2026-11-20: tweeter-shared/src/model/net/request/AuthenticatedRequest.ts (new file), tweeter-shared/src/model/net/request/PagedItemRequest.ts (new file), tweeter-shared/src/model/net/response/PagedItemResponse.ts (new file), tweeter-shared/src/model/net/request/PagedUserItemRequest.ts, tweeter-shared/src/model/net/request/PagedStatusItemRequest.ts, tweeter-shared/src/model/net/response/PagedUserItemResponse.ts, tweeter-shared/src/model/net/response/PagedStatusItemResponse.ts, tweeter-shared/src/model/net/request/GetCountRequest.ts, tweeter-shared/src/model/net/request/GetUserRequest.ts, tweeter-shared/src/model/net/request/IsFollowerRequest.ts, tweeter-shared/src/model/net/request/LogoutRequest.ts, tweeter-shared/src/model/net/request/PostStatusRequest.ts, tweeter-shared/src/index.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Refactor #4: remove duplication in the shared request/response types by adding an AuthenticatedRequest base (holds token) and generic PagedItemRequest<T>/PagedItemResponse<T>, making the existing request types extend them and the paged User/Status types aliases of the generics. Approved creating the 3 new files; GetCountRequest rename skipped.
- Review: The refactoring looks good.

## 2026-11-20: tweeter-server/src/lambda/PagedItemHandler.ts (new file), tweeter-server/src/lambda/follow/GetFolloweesLambda.ts, tweeter-server/src/lambda/follow/GetFollowersLambda.ts, tweeter-server/src/lambda/status/GetFeedItemsLambda.ts, tweeter-server/src/lambda/status/GetStoryItemsLambda.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Refactor #2: remove duplication in the four paged-item lambdas by adding a generic createPagedItemHandler<T> factory (approved new file) that builds the handler and success response, so each lambda only supplies which service method loads the page.
- Review: generic factory looks good. Nothing unexpected.

## 2026-11-20: tweeter-server/src/model/service/Service.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/model/service/UserService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Refactor #5: remove duplication in the server services by turning Service into an abstract base class with a generic toDtoPage<D> helper (used by FollowService and StatusService getFakeData, which now extend Service), and extracting UserService follow/unfollow's shared count-fetching into a private getFollowCounts method.
- Review: The code looks good.

## 2026-11-20: tweeter-web/src/model/net/ServerFacade.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Refactor #1: remove duplication in the client ServerFacade by routing every call through a generic doRequest<REQ, RES, R> template (post, then extract the result or log and throw the server error), with generic getMoreItems<DTO, ITEM> for the four paged calls and signIn/getCount/changeFollow helpers for the login/register, count and follow/unfollow pairs. Public method signatures are unchanged.
- Review: Nothing unexpected. It works just fine.

## 2026-11-20: tweeter-server/template.yaml

- Tool: Claude Code (Claude Opus 5.5)
- Task: Add a commented description for each API method in template.yaml (one per lambda), describing what the endpoint does and its request/response fields.
- Review: Looks good.

## 2026-11-24: tweeter-server/src/model/dao/DAOFactory.ts, tweeter-server/src/model/dao/UserDAO.ts (new file), tweeter-server/src/model/dao/AuthTokenDAO.ts (new file), tweeter-server/src/model/dao/FollowDAO.ts (new file), tweeter-server/src/model/dao/StoryDAO.ts (new file), tweeter-server/src/model/dao/FeedDAO.ts (new file), tweeter-server/src/model/dao/ImageDAO.ts (new file)

- Tool: Claude Code (Claude Opus 5.5)
- Task: Milestone 4A: create the database-agnostic DAO interfaces (User, AuthToken, Follow, Story, Feed, Image) and the DAOFactory abstract factory interface that returns them.
- Review: The interfaces look reasonable.

## 2026-11-24: tweeter-server/src/model/dao/fake/FakeDAOFactory.ts (new file), tweeter-server/src/model/service/Service.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/lambda/follow/GetFolloweesLambda.ts, tweeter-server/src/lambda/follow/GetFollowersLambda.ts, tweeter-server/src/lambda/status/GetFeedItemsLambda.ts, tweeter-server/src/lambda/status/GetStoryItemsLambda.ts, tweeter-server/src/lambda/status/PostStatusLambda.ts, tweeter-server/src/lambda/user/FollowLambda.ts, tweeter-server/src/lambda/user/GetFolloweeCountLambda.ts, tweeter-server/src/lambda/user/GetFollowerCountLambda.ts, tweeter-server/src/lambda/user/GetIsFollowerLambda.ts, tweeter-server/src/lambda/user/GetUserLambda.ts, tweeter-server/src/lambda/user/LoginLambda.ts, tweeter-server/src/lambda/user/LogoutLambda.ts, tweeter-server/src/lambda/user/RegisterLambda.ts, tweeter-server/src/lambda/user/UnfollowLambda.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Milestone 4A: wire the DAOFactory through the Service base class and every lambda, moving FakeData behind temporary fake DAOs (FakeDAOFactory) so the services use only DAO interfaces and the server still runs.
- Review: TODO

## 2026-11-24: tweeter-web/src/model/net/ClientCommunicator.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Fix blank server error messages: ClientCommunicator now reads error.error, matching the { "error": "..." } body that template.yaml's error response templates return, instead of the missing errorMessage field.
- Review: one line changed, nothing wrong with it.

## 2026-11-24: tweeter-server/src/model/service/AuthorizationService.ts (new file)

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create AuthorizationService, which validates an auth token through AuthTokenDAO (exists, not expired after inactivity), refreshes its last-used time, and returns the owner's alias, throwing "[unauthorized]" errors otherwise. Not yet used by any other file.
- Review: Changed the AI's use of Date.now to what was recommended in class: Math.floor(Date.now() / 1000)

## 2026-11-24: tweeter-server/src/model/service/AuthorizationService.ts, tweeter-server/src/model/service/UserService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Make auth token timestamps use epoch seconds everywhere: rename the timeout constant to AUTH_TOKEN_TIMEOUT_SECONDS, and have UserService.startSession store the new token's timestamp in seconds instead of milliseconds.
- Review: The code is fine.

## 2026-11-24: tweeter-server/src/model/service/UserService.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/model/service/StatusService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Wire AuthorizationService into the three services: each creates one from its DAOFactory and calls authenticate(token) at the start of every method except login, register, and logout. UserService's private getFollowCounts now reads counts from the DAO directly so follow/unfollow authenticate only once.
- Review: I think this works fine.

## 2026-11-24: tweeter-server/src/model/service/UserService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Write the real follow and unfollow logic in UserService: use the alias from AuthorizationService as the current user, reject following yourself or a nonexistent user, add/remove the follow through FollowDAO only when it changes, and update both users' counts through UserDAO.
- Review: The logic makes sense.

## 2026-11-24: tweeter-server/src/model/service/StatusService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Write the postStatus fan-out: after saving the status to the author's story, page through the author's followers with FollowDAO (25 per page) and add the status to each page of followers' feeds with FeedDAO.putFeedItems.
- Review: Haven't tested this yet. But the logic doesn't look excessive.

## 2026-11-24: tweeter-server/src/model/service/UserService.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Add bcryptjs password hashing: register rejects taken aliases, hashes the password, uploads the image, and saves the user with UserDAO.putUser; login verifies the password against UserDAO.getPasswordHash with bcrypt.compare.
- Review: Waiting till Dynamobb is up before fully testing, but looks simple and fine.

## 2026-11-24: tweeter-server/src/lambda/DAOFactoryProvider.ts (new file), tweeter-server/src/lambda/follow/GetFolloweesLambda.ts, tweeter-server/src/lambda/follow/GetFollowersLambda.ts, tweeter-server/src/lambda/status/GetFeedItemsLambda.ts, tweeter-server/src/lambda/status/GetStoryItemsLambda.ts, tweeter-server/src/lambda/status/PostStatusLambda.ts, tweeter-server/src/lambda/user/FollowLambda.ts, tweeter-server/src/lambda/user/GetFolloweeCountLambda.ts, tweeter-server/src/lambda/user/GetFollowerCountLambda.ts, tweeter-server/src/lambda/user/GetIsFollowerLambda.ts, tweeter-server/src/lambda/user/GetUserLambda.ts, tweeter-server/src/lambda/user/LoginLambda.ts, tweeter-server/src/lambda/user/LogoutLambda.ts, tweeter-server/src/lambda/user/RegisterLambda.ts, tweeter-server/src/lambda/user/UnfollowLambda.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Add a DAOFactoryProvider with getDAOFactory(), the single place that chooses the DAOFactory (currently FakeDAOFactory), and have every lambda get its factory from it instead of creating FakeDAOFactory directly.
- Review: Looks good. The code doesn't change too much in each file.

## 2026-11-24: tweeter-server/src/model/dao/fake/FakeDAOFactory.ts

- Tool: Claude Code (Claude Opus 5.5)
- Task: Make FakeUserDAO.getPasswordHash return a bcrypt hash of a fixed test password ("password") for any FakeData user, so login works with the fake DAOs.
- Review: Just code for the temporary DAOs.

## 2026-11-24: tweeter-server/src/model/dao/dynamodb/DynamoClient.ts (new file), tweeter-server/src/model/dao/dynamodb/DynamoDAOFactory.ts (new file)

- Tool: Claude Code (Claude Opus 5.5)
- Task: Create DynamoClient (one shared DynamoDB document client for all DynamoDB DAOs) and DynamoDAOFactory, which implements DAOFactory and for now returns the fake DAOs for each DAO not yet written so they can be switched over one at a time.
- Review: Looks good.
