"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
// AI-assisted: see AI-ATTRIBUTION.md
const tweeter_shared_1 = require("tweeter-shared");
const Service_1 = require("./Service");
class StatusService extends Service_1.Service {
    async loadMoreFeedItems(token, userAlias, pageSize, lastItem) {
        // TODO: Replace with the result of calling the database
        return this.getFakeData(lastItem, pageSize);
    }
    async loadMoreStoryItems(token, userAlias, pageSize, lastItem) {
        // TODO: Replace with the result of calling the database
        return this.getFakeData(lastItem, pageSize);
    }
    async postStatus(token, newStatus) {
        // TODO: Save the status to the database
    }
    async getFakeData(lastItem, pageSize) {
        return this.toDtoPage(tweeter_shared_1.FakeData.instance.getPageOfStatuses(tweeter_shared_1.Status.fromDto(lastItem), pageSize));
    }
}
exports.StatusService = StatusService;
