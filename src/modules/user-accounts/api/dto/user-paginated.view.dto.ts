export class UserPaginatedViewDto<T> {
  items: T[];
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;

  static mapToView<T>(data: {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
  }): UserPaginatedViewDto<T> {
    return {
      totalCount: data.totalCount,
      pagesCount: Math.ceil(data.totalCount / data.pageSize),
      page: data.page,
      pageSize: data.pageSize,
      items: data.items,
    };
  }
}
