import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SignUpDTO } from '@techno-watcher/api-models';
import { AuthFacade } from '../../../../+state/auth/auth.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'techno-watcher-sign-in',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPageComponent {
  public form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  public isLoading$: Observable<boolean> = this.authFacade.isLoading$;

  public get emailFormControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  public get passwordFormControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  public constructor(private authFacade: AuthFacade) {}

  public submitForm(signUpDTO: SignUpDTO): void {
    this.authFacade.signIn(signUpDTO);
  }
}
