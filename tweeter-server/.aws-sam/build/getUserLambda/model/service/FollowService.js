"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const FakeData_1 = require("tweeter-shared/dist/util/FakeData");
class FollowService {
    async loadMoreFollowees(token, userAlias, pageSize, lastFollowee) {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastFollowee, pageSize, userAlias);
    }
    async loadMoreFollowers(token, userAlias, pageSize, lastFollower) {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastFollower, pageSize, userAlias);
    }
    async getFakeData(lastFollower, pageSize, userAlias) {
        const [items, hasMore] = FakeData_1.FakeData.instance.getPageOfUsers(tweeter_shared_1.User.fromDto(lastFollower), pageSize, userAlias);
        const dtos = items.map((user) => user.dto);
        return [dtos, hasMore];
    }
}
exports.FollowService = FollowService;
