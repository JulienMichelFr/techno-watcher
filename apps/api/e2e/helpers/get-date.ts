import { randBetweenDate } from '@ngneat/falso';

export function getDate(from: Date = new Date('01/01/2022'), to: Date = new Date('12/31/2022')): Date {
  return randBetweenDate({ from, to });
}
