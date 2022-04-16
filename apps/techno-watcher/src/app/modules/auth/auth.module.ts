import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignUpPageComponent } from './pages/sign-up/sign-up-page.component';
import { SignUpFormComponent } from './components/sign-up-form/sign-up-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SignInPageComponent } from './pages/sign-in/sign-in-page.component';

@NgModule({
  declarations: [SignUpPageComponent, SignUpFormComponent, SignInPageComponent],
  imports: [CommonModule, AuthRoutingModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, FormsModule, MatButtonModule, MatCardModule],
})
export class AuthModule {}
