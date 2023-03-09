import { Paginated } from './api-interface';

export const paginate = <T>(
  results: T,
  count: number,
  skip: number,
  take: number
): Paginated<T> => ({
  data: results,
  meta: {
    offset: skip,
    pageSize: take,
    total: count,
    hasPrev: skip !== 0,
    hasNext: take + skip < count,
  },
});
