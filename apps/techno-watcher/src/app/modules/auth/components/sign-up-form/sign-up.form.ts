import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { PASSWORD_REGEXP, SignUpDTO } from '@techno-watcher/api-models';

export class SignUpForm extends FormGroup<{
  username: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  invitation: FormControl<string>;
}> {
  public get username(): FormControl<string> {
    return this.controls.username;
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

  public get email(): FormControl<string> {
    return this.controls.email;
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

  public get password(): FormControl {
    return this.controls.password;
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

  public get confirmPassword(): FormControl<string> {
    return this.controls.confirmPassword;
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
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return !!(control?.touched && (control?.invalid || form?.hasError('passwordAreSame')));
    },
  };

  public get invitation(): FormControl {
    return this.controls.invitation;
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
        username: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(20)], nonNullable: true }),
        email: new FormControl<string>('', { validators: [Validators.required, Validators.email], nonNullable: true }),
        password: new FormControl<string>('', {
          validators: [Validators.required, Validators.minLength(8), Validators.maxLength(32), Validators.pattern(PASSWORD_REGEXP)],
          nonNullable: true,
        }),
        confirmPassword: new FormControl<string>('', { validators: [Validators.required], nonNullable: true }),
        invitation: new FormControl<string>('', { validators: [Validators.required], nonNullable: true }),
      },
      [SignUpForm.passwordAreSameValidator()]
    );
  }

  private static passwordAreSameValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const formGroup: SignUpForm = form as SignUpForm;

      const passwordControl: FormControl<string> = formGroup.password;
      const confirmPasswordControl: FormControl<string> = formGroup.confirmPassword;

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
    this.username.setValue(value?.username ?? '');
    this.email.setValue(value?.email ?? '');
    this.password.setValue(value?.password ?? '');
    this.confirmPassword.setValue(value?.password ?? '');
    this.invitation.setValue(value?.invitation ?? '');
    this.markAsPristine();
    this.markAsUntouched();
  }

  public toDTO(): SignUpDTO {
    return new SignUpDTO(this.username.value, this.email.value, this.password.value, this.invitation.value);
  }
}
