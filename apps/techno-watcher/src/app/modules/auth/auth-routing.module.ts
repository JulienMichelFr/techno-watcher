import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpPageComponent } from './pages/sign-up/sign-up-page.component';
import { SignInPageComponent } from './pages/sign-in/sign-in-page.component';

const routes: Routes = [
  { path: 'sign-up', component: SignUpPageComponent },
  { path: 'sign-in', component: SignInPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
