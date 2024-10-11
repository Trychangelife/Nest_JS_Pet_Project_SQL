export type ConstructorPaginationType = { pageNumber: number, pageSize: number, sortBy: string, sortDirection: string, searchLoginTerm: string, searchEmailTerm: string };
export function constructorPagination(pageSize: string | undefined, pageNumber: string | undefined, sortBy: string | undefined, sortDirection: string | undefined, searchLoginTerm?: null | string, searchEmailTerm?: null | string): ConstructorPaginationType {
  let result: ConstructorPaginationType = { pageSize: 10, pageNumber: 1, sortBy: 'createdAt', sortDirection: 'desc' , searchLoginTerm: null, searchEmailTerm: null}
  if (pageSize) result.pageSize = +pageSize
  if (pageNumber) result.pageNumber = +pageNumber
  if (sortBy) result.sortBy = sortBy
  if (sortDirection) result.sortDirection = sortDirection
  if (searchLoginTerm) result.searchLoginTerm = searchLoginTerm
  if (searchEmailTerm) result.searchEmailTerm = searchEmailTerm
  return result
}