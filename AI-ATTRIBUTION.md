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
