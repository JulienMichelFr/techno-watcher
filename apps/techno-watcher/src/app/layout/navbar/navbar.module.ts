import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './containers/navbar/navbar.component';
import { AuthComponent } from './components/auth/auth.component';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatInputModule, RouterModule, MatIconModule, MatMenuModule],
  declarations: [NavbarComponent, AuthComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
