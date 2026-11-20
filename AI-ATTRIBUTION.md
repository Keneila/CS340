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
