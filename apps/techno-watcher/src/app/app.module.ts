import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';

import { AuthEffects } from './+state/auth/auth.effects';
import { AuthFacade } from './+state/auth/auth.facade';
import * as fromAuth from './+state/auth/auth.reducer';
import { AUTH_FEATURE_KEY } from './+state/auth/auth.reducer';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { NavbarModule } from './layout/navbar/navbar.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PostComponentModule } from './shared/components/post/post-component.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent, HomePageComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NavbarModule,
    AppRoutingModule,
    PostComponentModule,
    MatSnackBarModule,
    StoreModule.forRoot(
      {
        [AUTH_FEATURE_KEY]: fromAuth.authReducer,
      } as ActionReducerMap<unknown>,
      {
        metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot([AuthEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  providers: [
    AuthFacade,
    { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
