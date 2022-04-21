import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable, skipWhile, switchMap, take } from 'rxjs';
import { getAccessToken } from '../+state/auth/auth.selectors';
import { JWT_REQUIRED } from '../constantes/jwt-required-http-context';
import {Injectable} from "@angular/core";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  public constructor(private store: Store) {}

  public intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    if (!req.context.get(JWT_REQUIRED)) {
      return next.handle(req);
    }

    return this.store.select(getAccessToken).pipe(
      skipWhile((token) => !token),
      take(1),
      switchMap((token) => {
        if (token) {
          const cloned: HttpRequest<T> = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token),
          });
          return next.handle(cloned);
        }
        return next.handle(req);
      })
    );
  }
}
