import { AbstractControl, FormGroupDirective, NgForm, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { PASSWORD_REGEXP, SignUpDTO } from '@techno-watcher/api-models';

export class SignUpForm extends UntypedFormGroup {
  public get username(): UntypedFormControl {
    return this.get('username') as UntypedFormControl;
  }

  public get usernameErrorMessage(): string | null {
    if (!this.username.touched) {
      return null;
    }

    if (this.username.hasError('required')) {
      return 'Username is required';
    }

    if (this.username.hasError('minlength')) {
      const minLength: number = this.username.getError('minlength').requiredLength;
      return `Username must be at least ${minLength} characters long`;
    }

    if (this.username.hasError('maxlength')) {
      const maxLength: number = this.username.getError('maxlength').requiredLength;
      return `Username must be at most ${maxLength} characters long`;
    }

    return null;
  }

  public get email(): UntypedFormControl {
    return this.get('email') as UntypedFormControl;
  }

  public get emailErrorMessage(): string | null {
    if (!this.email.touched) {
      return null;
    }

    if (this.email.hasError('required')) {
      return 'Email is required';
    }

    if (this.email.hasError('email')) {
      return 'Email is invalid';
    }

    return null;
  }

  public get password(): UntypedFormControl {
    return this.get('password') as UntypedFormControl;
  }

  public get passwordErrorMessage(): string | null {
    if (!this.password.touched) {
      return null;
    }

    if (this.password.hasError('required')) {
      return 'Password is required';
    }

    if (this.password.hasError('minlength')) {
      const minLength: number = this.password.getError('minlength').requiredLength;
      return `Password must be at least ${minLength} characters long`;
    }

    if (this.password.hasError('maxlength')) {
      const maxLength: number = this.password.getError('maxlength').requiredLength;
      return `Password must be at most ${maxLength} characters long`;
    }

    if (this.password.hasError('pattern')) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
    }

    return null;
  }

  public get confirmPassword(): UntypedFormControl {
    return this.get('confirmPassword') as UntypedFormControl;
  }

  public get confirmPasswordErrorMessage(): string | null {
    if (!this.confirmPassword.touched) {
      return null;
    }

    if (this.confirmPassword.hasError('required')) {
      return 'Confirm password is required';
    }

    if (this.confirmPassword.hasError('passwordAreSame')) {
      return 'Passwords should match';
    }

    return null;
  }

  public confirmPasswordErrorStateMatcher: ErrorStateMatcher = {
    isErrorState(control: UntypedFormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return !!(control?.touched && (control?.invalid || form?.hasError('passwordAreSame')));
    },
  };

  public get invitation(): UntypedFormControl {
    return this.get('invitation') as UntypedFormControl;
  }

  public get invitationErrorMessage(): string | null {
    if (!this.invitation.touched) {
      return null;
    }

    if (this.invitation.hasError('required')) {
      return 'Invitation is required';
    }

    return null;
  }

  public constructor() {
    super(
      {
        username: new UntypedFormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
        email: new UntypedFormControl(null, [Validators.required, Validators.email]),
        password: new UntypedFormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(32), Validators.pattern(PASSWORD_REGEXP)]),
        confirmPassword: new UntypedFormControl(null, [Validators.required]),
        invitation: new UntypedFormControl(null, [Validators.required]),
      },
      [SignUpForm.passwordAreSameValidator()]
    );
  }

  private static passwordAreSameValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const formGroup: SignUpForm = form as SignUpForm;

      const passwordControl: UntypedFormControl = formGroup.password;
      const confirmPasswordControl: UntypedFormControl = formGroup.confirmPassword;

      if (!passwordControl.touched || !confirmPasswordControl.touched || confirmPasswordControl.invalid) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordAreSame: true });
        return { passwordAreSame: true };
      }

      return null;
    };
  }

  public fromDTO(value: Partial<SignUpDTO>): void {
    this.username.setValue(value?.username ?? null);
    this.email.setValue(value?.email ?? null);
    this.password.setValue(value?.password ?? null);
    this.confirmPassword.setValue(value?.password ?? null);
    this.invitation.setValue(value?.invitation ?? null);
    this.markAsPristine();
    this.markAsUntouched();
  }

  public toDTO(): SignUpDTO {
    return new SignUpDTO(this.username.value, this.email.value, this.password.value, this.invitation.value);
  }
}
