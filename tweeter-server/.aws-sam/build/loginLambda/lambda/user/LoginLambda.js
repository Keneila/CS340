"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../../model/service/UserService");
const handler = async (request) => {
    const userService = new UserService_1.UserService();
    const [user, token] = await userService.login(request.alias, request.password);
    return {
        success: true,
        message: null,
        user: user,
        token: token,
    };
};
exports.handler = handler;
