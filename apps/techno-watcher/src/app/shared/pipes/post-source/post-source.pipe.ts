import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postSource',
})
export class PostSourcePipe implements PipeTransform {
  public transform(value: string): string {
    try {
      const url: URL = new URL(value);
      return url.hostname;
    } catch (e) {
      return value;
    }
  }
}
