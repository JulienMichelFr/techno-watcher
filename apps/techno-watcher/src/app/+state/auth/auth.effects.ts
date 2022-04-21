import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';

import * as fromActions from './auth.actions';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Router } from '@angular/router';

export const AUTH_LOCAL_STORAGE_KEY: string = 'auth';

@Injectable()
export class AuthEffects {
  public constructor(private readonly actions$: Actions, private authService: AuthService, private router: Router) {}

  // eslint-disable-next-line @typescript-eslint/typedef
  public init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => fromActions.init({ payload: { accessToken: localStorage.getItem(AUTH_LOCAL_STORAGE_KEY) } }))
    )
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  public signInStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.signInStart),
      mergeMap(({ payload }) => this.authService.signIn(payload)),
      map(({ accessToken }) => fromActions.signInSuccess({ payload: { accessToken } })),
      // TODO Add error handling
      catchError(() => of(fromActions.signInFail({ payload: {} })))
    )
  );

  // eslint-disable-next-line @typescript-eslint/typedef
  public signUpStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.signUpStart),
      mergeMap(({ payload }) => this.authService.signUp(payload)),
      map(({ accessToken }) => fromActions.signUpSuccess({ payload: { accessToken } })),
      // TODO Add error handling
      catchError(() => of(fromActions.signUpFail({ payload: {} })))
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
  public storeTokenInLocalStorage$ = createEffect(
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
        map(() => localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY))
      ),
    { dispatch: false }
  );
}