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
