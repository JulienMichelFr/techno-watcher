import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { SignInDTO } from '@techno-watcher/api-models';

import { AuthFacade } from '../../../../+state/auth/auth.facade';

type SignUpDTOFormGroup = {
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'techno-watcher-sign-in',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPageComponent {
  public form: FormGroup<SignUpDTOFormGroup> = new FormGroup<SignUpDTOFormGroup>({
    email: new FormControl<string>('', { validators: [Validators.required, Validators.email], nonNullable: true }),
    password: new FormControl<string>('', { validators: [Validators.required], nonNullable: true }),
  });

  public isLoading$: Observable<boolean> = this.authFacade.isLoading$;

  public get emailFormControl(): FormControl<string> {
    return this.form.controls.email;
  }

  public get passwordFormControl(): FormControl<string> {
    return this.form.controls.password;
  }

  public constructor(private authFacade: AuthFacade) {}

  public submitForm(form: FormGroup<SignUpDTOFormGroup>): void {
    const signInDTO: SignInDTO = {
      email: form.controls.email.value,
      password: form.controls.password.value,
    };

    this.authFacade.signIn(signInDTO);
  }
}
