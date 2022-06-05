import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, skipWhile, switchMap, take, throwError } from 'rxjs';

import { AuthFacade } from '../+state/auth/auth.facade';
import { AuthState } from '../+state/auth/auth.models';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  public constructor(private authFacade: AuthFacade) {}

  public intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && err?.error?.message === 'Token expired') {
          return this.tryRefreshToken(req, next);
        }
        return throwError(() => err);
      })
    );
  }

  public tryRefreshToken<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return this.authFacade.authState$.pipe(
      skipWhile((authState) => authState.loading),
      take(1),
      switchMap((authState: AuthState) => {
        if (authState.refreshToken) {
          this.authFacade.refreshToken(authState.refreshToken);
        }

        return this.authFacade.authState$.pipe(
          skipWhile((authState) => authState.loading),
          take(1),
          switchMap((authState: AuthState) => {
            if (authState.accessToken) {
              request = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${authState.accessToken}`,
                },
              });
            }

            return next.handle(request);
          })
        );
      })
    );
  }
}
