import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SignInDTO, SignUpDTO } from '@techno-watcher/api-models';

import * as AuthActions from './auth.actions';
import { AuthState, AuthStateUserProfile } from './auth.models';
import * as AuthSelectors from './auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  public authState$: Observable<AuthState> = this.store.pipe(select(AuthSelectors.getAuthState));
  public isLoading$: Observable<boolean> = this.store.pipe(select(AuthSelectors.authStateIsLoading));
  public accessToken$: Observable<string | null> = this.store.pipe(select(AuthSelectors.getAccessToken));
  public profile$: Observable<AuthStateUserProfile | null> = this.store.pipe(select(AuthSelectors.getProfile));
  public tokenExpirationDate$: Observable<number | null> = this.store.pipe(select(AuthSelectors.getTokenExpirationDate));
  public isSignedIn$: Observable<boolean> = this.store.pipe(select(AuthSelectors.isSignedIn));

  public constructor(private readonly store: Store) {}

  public signIn(signInDTO: SignInDTO): void {
    this.store.dispatch(AuthActions.signInStart({ payload: signInDTO }));
  }

  public signUp(signUpDTO: SignUpDTO): void {
    this.store.dispatch(AuthActions.signUpStart({ payload: signUpDTO }));
  }

  public refreshToken(refreshToken: string): void {
    this.store.dispatch(AuthActions.refreshTokenStart({ payload: { refreshToken } }));
  }

  public signOut(): void {
    this.store.dispatch(AuthActions.signOut());
  }
}
