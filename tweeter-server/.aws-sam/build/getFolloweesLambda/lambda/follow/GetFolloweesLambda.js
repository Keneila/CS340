"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const PagedItemHandler_1 = require("../PagedItemHandler");
exports.handler = (0, PagedItemHandler_1.createPagedItemHandler)((token, userAlias, pageSize, lastItem) => new FollowService_1.FollowService().loadMoreFollowees(token, userAlias, pageSize, lastItem));
