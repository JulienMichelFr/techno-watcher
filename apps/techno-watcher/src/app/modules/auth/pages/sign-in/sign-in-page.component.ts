import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { SignUpDTO } from '@techno-watcher/api-models';

@Component({
  selector: 'techno-watcher-sign-in',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss'],
})
export class SignInPageComponent {
  public form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  public isLoading: boolean = false;

  public get emailFormControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  public get passwordFormControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  public constructor(private authService: AuthService) {}

  public submitForm(signUpDTO: SignUpDTO): void {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.authService.signIn(signUpDTO).subscribe(() => {
      this.isLoading = false;
    });
  }
}
