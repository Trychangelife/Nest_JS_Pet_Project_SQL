"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructorPagination = constructorPagination;
function constructorPagination(pageSize, pageNumber, sortBy, sortDirection, searchLoginTerm, searchEmailTerm) {
    let result = { pageSize: 10, pageNumber: 1, sortBy: 'createdAt', sortDirection: 'desc', searchLoginTerm: null, searchEmailTerm: null };
    if (pageSize)
        result.pageSize = +pageSize;
    if (pageNumber)
        result.pageNumber = +pageNumber;
    if (sortBy)
        result.sortBy = sortBy;
    if (sortDirection)
        result.sortDirection = sortDirection;
    if (searchLoginTerm)
        result.searchLoginTerm = searchLoginTerm;
    if (searchEmailTerm)
        result.searchEmailTerm = searchEmailTerm;
    return result;
}
//# sourceMappingURL=pagination.constructor.js.map