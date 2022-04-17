import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthFacade } from '../../../../+state/auth/auth.facade';
import { Observable } from 'rxjs';
import { AuthStateUserProfile } from '../../../../+state/auth/auth.models';

@Component({
  selector: 'techno-watcher-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  public isLoading$: Observable<boolean> = this.authFacade.isLoading$;
  public profile$: Observable<AuthStateUserProfile | null> = this.authFacade.profile$;

  public constructor(private authFacade: AuthFacade) {}

  public signOut(): void {
    this.authFacade.signOut();
  }
}
