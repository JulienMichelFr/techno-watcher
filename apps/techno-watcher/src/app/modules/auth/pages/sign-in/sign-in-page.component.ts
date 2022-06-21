import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { SignUpDTO } from '@techno-watcher/api-models';

import { AuthFacade } from '../../../../+state/auth/auth.facade';

@Component({
  selector: 'techno-watcher-sign-in',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPageComponent {
  public form: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl(null, [Validators.required, Validators.email]),
    password: new UntypedFormControl(null, [Validators.required]),
  });

  public isLoading$: Observable<boolean> = this.authFacade.isLoading$;

  public get emailFormControl(): UntypedFormControl {
    return this.form.get('email') as UntypedFormControl;
  }

  public get passwordFormControl(): UntypedFormControl {
    return this.form.get('email') as UntypedFormControl;
  }

  public constructor(private authFacade: AuthFacade) {}

  public submitForm(signUpDTO: SignUpDTO): void {
    this.authFacade.signIn(signUpDTO);
  }
}
