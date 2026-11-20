"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
// AI-assisted: see AI-ATTRIBUTION.md
const tweeter_shared_1 = require("tweeter-shared");
const Service_1 = require("./Service");
class UserService extends Service_1.Service {
    async getUser(token, alias) {
        // TODO: Replace with the result of calling the database
        const user = tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
        return user ? user.dto : null;
    }
    async login(alias, password) {
        // TODO: Replace with the result of calling the database
        return this.getsignInFakeData("Invalid alias or password");
    }
    async register(firstName, lastName, alias, password, userImageBytes, imageFileExtension) {
        // TODO: Replace with the result of calling the database
        return this.getsignInFakeData("Invalid registration");
    }
    async getsignInFakeData(errorMessage) {
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error(`[bad-request] ${errorMessage}`);
        }
        return [user.dto, tweeter_shared_1.FakeData.instance.authToken.token];
    }
    async getIsFollowerStatus(token, userAlias, selectedUserAlias) {
        // TODO: Replace with the result of calling the database
        return await tweeter_shared_1.FakeData.instance.isFollower();
    }
    async getFolloweeCount(token, userAlias) {
        // TODO: Replace with the result of calling the database
        return await tweeter_shared_1.FakeData.instance.getFolloweeCount(userAlias);
    }
    async getFollowerCount(token, userAlias) {
        // TODO: Replace with the result of calling the database
        return await tweeter_shared_1.FakeData.instance.getFollowerCount(userAlias);
    }
    async unfollow(token, userToUnfollowAlias) {
        // TODO: Remove the follow relationship from the database
        return this.getFollowCounts(token, userToUnfollowAlias);
    }
    async follow(token, userToFollowAlias) {
        // TODO: Add the follow relationship to the database
        return this.getFollowCounts(token, userToFollowAlias);
    }
    async getFollowCounts(token, userAlias) {
        const followerCount = await this.getFollowerCount(token, userAlias);
        const followeeCount = await this.getFolloweeCount(token, userAlias);
        return [followerCount, followeeCount];
    }
    async logout(token) {
        // TODO: Invalidate the token in the database
    }
}
exports.UserService = UserService;
