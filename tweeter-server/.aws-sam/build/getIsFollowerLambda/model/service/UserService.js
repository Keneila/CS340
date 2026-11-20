"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
// AI-assisted: see AI-ATTRIBUTION.md
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
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
    async unfollow(authToken, userToUnfollow) {
        // Pause so we can see the unfollow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server
        const followerCount = await this.getFollowerCount(authToken.token, userToUnfollow.alias);
        const followeeCount = await this.getFolloweeCount(authToken.token, userToUnfollow.alias);
        return [followerCount, followeeCount];
    }
    async follow(authToken, userToFollow) {
        // Pause so we can see the follow message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server
        const followerCount = await this.getFollowerCount(authToken.token, userToFollow.alias);
        const followeeCount = await this.getFolloweeCount(authToken.token, userToFollow.alias);
        return [followerCount, followeeCount];
    }
    async logout(token) {
        // TODO: Invalidate the token in the database
    }
    async postStatus(authToken, newStatus) {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
        // TODO: Call the server to post the status
    }
}
exports.UserService = UserService;
