import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { NavbarModule } from './layout/navbar/navbar.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PostComponentModule } from './shared/components/post/post-component.module';

@NgModule({
  declarations: [AppComponent, HomePageComponent],
  imports: [BrowserModule, HttpClientModule, BrowserAnimationsModule, NavbarModule, AppRoutingModule, PostComponentModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
