import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as AuthSelectors from './auth.selectors';
import * as AuthActions from './auth.actions';
import { Observable } from 'rxjs';
import { AuthStateUserProfile } from './auth.models';
import { SignInDTO, SignUpDTO } from '@techno-watcher/api-models';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  public isLoading$: Observable<boolean> = this.store.pipe(select(AuthSelectors.authStateIsLoading));
  public accessToken$: Observable<string | null> = this.store.pipe(select(AuthSelectors.getAccessToken));
  public profile$: Observable<AuthStateUserProfile | null> = this.store.pipe(select(AuthSelectors.getProfile));
  public tokenExpirationDate$: Observable<number | null> = this.store.pipe(select(AuthSelectors.getTokenExpirationDate));

  public constructor(private readonly store: Store) {}

  public signIn(signInDTO: SignInDTO): void {
    this.store.dispatch(AuthActions.signInStart({ payload: signInDTO }));
  }

  public signUp(signUpDTO: SignUpDTO): void {
    this.store.dispatch(AuthActions.signUpStart({ payload: signUpDTO }));
  }
}
