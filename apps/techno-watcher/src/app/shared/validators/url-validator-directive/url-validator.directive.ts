import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[technoWatcherUrlValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: UrlValidatorDirective, multi: true }],
})
export class UrlValidatorDirective implements Validator {
  public validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    try {
      new URL(control.value);
    } catch (e) {
      return { url: true };
    }
    return null;
  }
}
