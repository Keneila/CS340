"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../../model/service/UserService");
const handler = async (request) => {
    const userService = new UserService_1.UserService();
    const count = await userService.getFolloweeCount(request.token, request.userAlias);
    return {
        success: true,
        message: null,
        count: count,
    };
};
exports.handler = handler;
