export type Sort<T> = `${keyof T & string}:${'asc' | 'desc'}`;
