export type Paginated<T> = {
  data: T[];
  total: number;
  perPage: number;
  from: number;
  to: number;
};
