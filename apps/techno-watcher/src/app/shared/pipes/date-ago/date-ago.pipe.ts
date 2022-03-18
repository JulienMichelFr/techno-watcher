import { Pipe, PipeTransform } from '@angular/core';
import { LogArgs } from '@techno-watcher/tools';

const A_MINUTE: number = 1;
const AN_HOUR: number = 60 * A_MINUTE;
const A_DAY: number = 24 * AN_HOUR;

@Pipe({
  name: 'dateAgo',
})
export class DateAgoPipe implements PipeTransform {
  private readonly intl: Intl.RelativeTimeFormat = new Intl.RelativeTimeFormat('en', {
    style: 'long',
    numeric: 'auto',
  });

  @LogArgs()
  public transform(value: Date | string, existingDate: Date = new Date()): string {
    if (!value) {
      return '';
    }
    if (!(value instanceof Date)) {
      value = new Date(value);
    }

    const compared: number = Math.round((value.getTime() - existingDate.getTime()) / 1000 / 60);
    switch (true) {
      case Math.abs(compared) < A_MINUTE:
        return 'less than a minutes ago';
      case Math.abs(compared) < 60: {
        return this.intl.format(compared, 'minutes');
      }
      case Math.abs(compared) < 60 * 24: {
        return this.intl.format(Math.round(compared / 60), 'hours');
      }
      default: {
        return this.intl.format(Math.round(compared / 60 / 24), 'days');
      }
    }
  }
}
