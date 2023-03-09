export type Paginated<T> = {
  data: T;
  meta: {
    total: number;
    pageSize: number;
    offset: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};