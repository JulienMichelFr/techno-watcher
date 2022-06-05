import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SignUpFormComponent } from './components/sign-up-form/sign-up-form.component';
import { SignInPageComponent } from './pages/sign-in/sign-in-page.component';
import { SignUpPageComponent } from './pages/sign-up/sign-up-page.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [SignUpPageComponent, SignUpFormComponent, SignInPageComponent],
  imports: [CommonModule, AuthRoutingModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, FormsModule, MatButtonModule, MatCardModule],
})
export class AuthModule {}
