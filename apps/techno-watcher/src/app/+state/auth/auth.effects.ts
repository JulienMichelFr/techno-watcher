import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as AuthActions from './auth.actions';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class AuthEffects {
  public constructor(private readonly actions$: Actions, private authService: AuthService) {}

  // eslint-disable-next-line @typescript-eslint/typedef
  public signInStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInStart),
      mergeMap(({ payload }) => this.authService.signIn(payload)),
      map(({ accessToken }) => AuthActions.signInSuccess({ payload: { accessToken } })),
      // TODO Add error handling
      catchError(() => of(AuthActions.signInFail({ payload: {} })))
    )
  );
}
