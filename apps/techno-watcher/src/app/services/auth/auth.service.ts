import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { AuthResponseModel, SignInDTO, SignUpDTO } from '@techno-watcher/api-models';
import { catchError, Observable, throwError } from 'rxjs';
import { JWT_REQUIRED } from '../../constantes/jwt-required-http-context';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = `${this.configService.get('apiUrl')}/auth`;

  public constructor(protected http: HttpClient, protected configService: ConfigService, private snackbar: MatSnackBar) {}

  public signUp(signUpDto: SignUpDTO): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(`${this.baseUrl}/sign-up`, signUpDto, { context: new HttpContext().set(JWT_REQUIRED, false) }).pipe(
      catchError((error: Error) => {
        if (error instanceof HttpErrorResponse && error?.error?.message === 'Invalid invitation')
          this.snackbar.open(error.error.message, '', { duration: 3000 });
        return throwError(() => error);
      })
    );
  }

  public signIn(signInDto: SignInDTO): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(`${this.baseUrl}/sign-in`, signInDto, { context: new HttpContext().set(JWT_REQUIRED, false) });
  }

  public refreshToken(refreshToken: string): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(`${this.baseUrl}/refresh-token`, { refreshToken }, { context: new HttpContext().set(JWT_REQUIRED, false) });
  }
}
