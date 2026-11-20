"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
// AI-assisted: see AI-ATTRIBUTION.md
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    async getUser(authToken, alias) {
        // TODO: Replace with the result of calling server
        return await tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
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
    async getIsFollowerStatus(authToken, user, selectedUser) {
        // TODO: Replace with the result of calling server
        return await tweeter_shared_1.FakeData.instance.isFollower();
    }
    async getFolloweeCount(authToken, user) {
        // TODO: Replace with the result of calling server
        return await tweeter_shared_1.FakeData.instance.getFolloweeCount(user.alias);
    }
    async getFollowerCount(authToken, user) {
        // TODO: Replace with the result of calling server
        return await tweeter_shared_1.FakeData.instance.getFollowerCount(user.alias);
    }
    async unfollow(authToken, userToUnfollow) {
        // Pause so we can see the unfollow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server
        const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);
        return [followerCount, followeeCount];
    }
    async follow(authToken, userToFollow) {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server
        const followerCount = await this.getFollowerCount(authToken, userToFollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToFollow);
        return [followerCount, followeeCount];
    }
    async logout(authToken) {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
    }
    async postStatus(authToken, newStatus) {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server to post the status
    }
}
exports.UserService = UserService;
