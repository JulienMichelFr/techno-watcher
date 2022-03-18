import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../services/config/config.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class ApiServiceBase<Model = unknown> {
  protected readonly apiUrl: string = this.configService.get('apiUrl');

  protected abstract readonly baseUrl: string;

  public constructor(protected http: HttpClient, protected configService: ConfigService) {}

  protected find(): Observable<Model[]> {
    return this.http.get<Model[]>(this.baseUrl);
  }

  protected findById(id: number): Observable<Model> {
    return this.http.get<Model>(`${this.baseUrl}/${id}`);
  }

  protected create(model: Partial<Model>): Observable<Model> {
    return this.http.post<Model>(this.baseUrl, model);
  }

  protected update(id: number, model: Partial<Model>): Observable<Model> {
    return this.http.put<Model>(`${this.baseUrl}/${id}`, model);
  }
}
