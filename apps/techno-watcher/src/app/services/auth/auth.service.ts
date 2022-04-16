import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { AuthResponseModel, SignUpDTO } from '@techno-watcher/api-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = `${this.configService.get('apiUrl')}/auth`;

  public constructor(protected http: HttpClient, protected configService: ConfigService) {}

  public signUp(signUpDto: SignUpDTO): Observable<AuthResponseModel> {
    return this.http.post<AuthResponseModel>(`${this.baseUrl}/sign-up`, signUpDto);
  }
}
