import { Component } from '@angular/core';
import { SignUpDTO } from '@techno-watcher/api-models';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'techno-watcher-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss'],
})
export class SignUpPageComponent {
  public isLoading: boolean = false;
  public signUpDTO: SignUpDTO = new SignUpDTO('', '', '');

  public constructor(private authService: AuthService) {}

  public submitForm(signUpDTO: SignUpDTO): void {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.authService.signUp(signUpDTO).subscribe({
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
