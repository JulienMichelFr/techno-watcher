import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppConfig } from '../../../types/app-config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly environment: AppConfig = environment;

  public get<T extends keyof AppConfig>(key: T): AppConfig[T] {
    return this.environment[key];
  }
}
