import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SignUpDTO } from '@techno-watcher/api-models';
import { AuthFacade } from '../../../../+state/auth/auth.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'techno-watcher-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpPageComponent {
  public isLoading$: Observable<boolean> = this.authFacade.isLoading$;
  public signUpDTO: SignUpDTO = new SignUpDTO('', '', '');

  public constructor(private authFacade: AuthFacade) {}

  public submitForm(signUpDTO: SignUpDTO): void {
    this.authFacade.signUp(signUpDTO);
  }
}
