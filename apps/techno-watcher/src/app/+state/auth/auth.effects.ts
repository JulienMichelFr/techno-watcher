import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';

import * as fromActions from './auth.actions';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, mergeMap, of, repeat, tap } from 'rxjs';
import { Router } from '@angular/router';
import { DecodedToken, decodeJwt } from '../../shared/utils/decode-jwt';

export const AUTH_LOCAL_STORAGE_KEY: string = 'auth';

@Injectable()
export class AuthEffects {
  public constructor(private readonly actions$: Actions, private authService: AuthService, private router: Router) {}

  // eslint-disable-next-line @typescript-eslint/typedef
  public initFromLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const refreshToken: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
        if (!refreshToken) {
          return fromActions.signOut();
        }
        const decoded: DecodedToken = decodeJwt(refreshToken);
        if (decoded.exp < Date.now()) {
          return fromActions.signOut();
        }

        return fromActions.refreshTokenStart({ payload: { refreshToken } });
      })
    )
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  public signInStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.signInStart),
      mergeMap(({ payload }) => this.authService.signIn(payload)),
      map((response) => fromActions.signInSuccess({ payload: response })),
      // TODO Add error handling
      catchError(() => of(fromActions.signInFail({ payload: {} }))),
      repeat()
    )
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  public signUpStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.signUpStart),
      mergeMap(({ payload }) => this.authService.signUp(payload)),
      map((response) => fromActions.signUpSuccess({ payload: response })),
      // TODO Add error handling
      catchError(() => {
        return of(fromActions.signUpFail({ payload: {} }));
      }),
      repeat()
    )
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  public refreshTokenStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.refreshTokenStart),
      mergeMap(({ payload }) => this.authService.refreshToken(payload.refreshToken)),
      map((response) => fromActions.refreshTokenSuccess({ payload: response })),
      // TODO Add error handling
      catchError(() => of(fromActions.refreshTokenFail({ payload: {} }))),
      repeat()
    )
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  public redirectToHomeOnSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.signInSuccess, fromActions.signUpSuccess),
        map(() => this.router.navigate(['/']))
      ),
    { dispatch: false }
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  public storeRefreshTokenInLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.signInSuccess, fromActions.signUpSuccess),
        map(({ payload }) => localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, payload.accessToken))
      ),
    { dispatch: false }
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  public removeTokenOnSignOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fromActions.signOut),
        tap(() => localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY))
      ),
    { dispatch: false }
  );
}
