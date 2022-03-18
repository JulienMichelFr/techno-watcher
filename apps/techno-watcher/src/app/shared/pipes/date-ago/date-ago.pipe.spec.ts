import { DateAgoPipe } from './date-ago.pipe';

describe('DateAgoPipe', () => {
  let pipe: DateAgoPipe;

  beforeEach(() => {
    pipe = new DateAgoPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return correct value', () => {
    const date: Date = new Date();
    const pastDate: Date = new Date(date.getTime() - 1000 * 60 * 60 * 24 * 2);
    expect(pipe.transform(pastDate)).toBe('2 days ago');
  });
});
