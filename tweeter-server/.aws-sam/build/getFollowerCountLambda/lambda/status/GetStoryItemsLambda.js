"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../../model/service/StatusService");
const PagedItemHandler_1 = require("../PagedItemHandler");
exports.handler = (0, PagedItemHandler_1.createPagedItemHandler)((token, userAlias, pageSize, lastItem) => new StatusService_1.StatusService().loadMoreStoryItems(token, userAlias, pageSize, lastItem));
