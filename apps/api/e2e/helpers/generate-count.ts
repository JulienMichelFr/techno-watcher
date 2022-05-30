export function generateCount<T>(count: number, fn: (index: number) => T): T[] {
  return Array.from({ length: count }).map((_, index) => fn(index));
}
