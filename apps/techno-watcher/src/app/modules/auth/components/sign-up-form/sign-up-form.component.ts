import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SignUpDTO } from '@techno-watcher/api-models';

import { noop, NoopFn } from '../../../../shared/utils/noop';

import { SignUpForm } from './sign-up.form';

type OnChangeFn = (value?: SignUpDTO) => void;
type OnTouchedFn = NoopFn;
type OnValidatorChangeFn = NoopFn;

@Component({
  selector: 'techno-watcher-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SignUpFormComponent,
      multi: true,
    },
    { provide: NG_VALIDATORS, useExisting: SignUpFormComponent, multi: true },
  ],
})
export class SignUpFormComponent implements ControlValueAccessor, Validator, AfterViewInit, OnDestroy {
  public readonly form: SignUpForm = new SignUpForm();

  private onChange: OnChangeFn = noop;
  private onTouched: OnTouchedFn = noop;
  private onValidatorChange: OnValidatorChangeFn = noop;
  private readonly subscription: Subscription = new Subscription();

  //#region Lifecycle hooks
  public ngAfterViewInit(): void {
    this.subscription.add(this.form.statusChanges.subscribe(() => this.onTouched()));
    this.subscription.add(
      this.form.valueChanges.subscribe(() => {
        this.emitValue();
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //#endregion

  //#region ControlValueAccessor

  public registerOnChange(fn: OnChangeFn): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  public writeValue(dto: Partial<SignUpDTO>): void {
    this.form.fromDTO(dto);
  }

  //#endregion

  //#region Validator
  public registerOnValidatorChange(fn: OnValidatorChangeFn): void {
    this.onValidatorChange = fn;
  }

  public validate(): ValidationErrors | null {
    if (!this.form.invalid) {
      return null;
    }
    return {
      username: this.form.usernameErrorMessage,
      email: this.form.emailErrorMessage,
      password: this.form.passwordErrorMessage,
      confirmPassword: this.form.confirmPasswordErrorMessage,
    };
  }

  //#endregion

  private emitValue(): void {
    if (this.onChange) {
      this.onChange(this.form.toDTO());
    }
    if (this.onValidatorChange) {
      this.onValidatorChange();
    }
  }
}
