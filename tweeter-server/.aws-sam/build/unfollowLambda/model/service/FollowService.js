"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
// AI-assisted: see AI-ATTRIBUTION.md
const tweeter_shared_1 = require("tweeter-shared");
const FakeData_1 = require("tweeter-shared/dist/util/FakeData");
const Service_1 = require("./Service");
class FollowService extends Service_1.Service {
    async loadMoreFollowees(token, userAlias, pageSize, lastFollowee) {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastFollowee, pageSize, userAlias);
    }
    async loadMoreFollowers(token, userAlias, pageSize, lastFollower) {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastFollower, pageSize, userAlias);
    }
    async getFakeData(lastItem, pageSize, userAlias) {
        return this.toDtoPage(FakeData_1.FakeData.instance.getPageOfUsers(tweeter_shared_1.User.fromDto(lastItem), pageSize, userAlias));
    }
}
exports.FollowService = FollowService;
