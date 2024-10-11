export type ConstructorPaginationType = {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: string;
    searchLoginTerm: string;
    searchEmailTerm: string;
};
export declare function constructorPagination(pageSize: string | undefined, pageNumber: string | undefined, sortBy: string | undefined, sortDirection: string | undefined, searchLoginTerm?: null | string, searchEmailTerm?: null | string): ConstructorPaginationType;
