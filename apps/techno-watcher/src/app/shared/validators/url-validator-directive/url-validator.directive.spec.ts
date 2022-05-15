import { UrlValidatorDirective } from './url-validator.directive';
import { AbstractControl, FormControl } from '@angular/forms';

describe('UrlValidatorDirective', () => {
  const directive: UrlValidatorDirective = new UrlValidatorDirective();
  let control: AbstractControl;

  beforeEach(() => {
    control = new FormControl();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should return null if control value is falsy', () => {
    expect(directive.validate(control)).toBeNull();
  });

  it('should return null if the url is valid', () => {
    control.setValue('https://www.google.com');
    expect(directive.validate(control)).toBeNull();
  });

  it('should return an error if the url is invalid', () => {
    control.setValue('invalid url');
    expect(directive.validate(control)).toEqual({ url: true });
  });
});
