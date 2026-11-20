"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPagedItemHandler = void 0;
// Builds a Lambda handler that loads one page of items and wraps it in a
// successful paged response. Each paged lambda only supplies how to load.
const createPagedItemHandler = (loadMore) => {
    return async (request) => {
        const [items, hasMore] = await loadMore(request.token, request.userAlias, request.pageSize, request.lastItem);
        return {
            success: true,
            message: null,
            items: items,
            hasMore: hasMore,
        };
    };
};
exports.createPagedItemHandler = createPagedItemHandler;
