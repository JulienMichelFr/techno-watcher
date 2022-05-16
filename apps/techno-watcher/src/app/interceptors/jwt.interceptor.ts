import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, skipWhile, switchMap, take } from 'rxjs';
import { JWT_REQUIRED } from '../constantes/jwt-required-http-context';
import { Injectable } from '@angular/core';
import { AuthFacade } from '../+state/auth/auth.facade';
import { AuthState } from '../+state/auth/auth.models';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  public constructor(private authFacade: AuthFacade) {}

  public intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    if (!req.context.get(JWT_REQUIRED)) {
      return next.handle(req);
    }

    return this.authFacade.authState$.pipe(
      skipWhile((authState) => authState.loading),
      take(1),
      switchMap((authState: AuthState) => {
        if (authState.accessToken) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${authState.accessToken}`,
            },
          });
        }
        return next.handle(req);
      })
    );
  }
}
