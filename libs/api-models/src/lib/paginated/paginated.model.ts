export class Paginated<T> {
  public data!: T[];
  public total!: number;
  public perPage!: number;
  public from!: number;
  public to!: number;
}
