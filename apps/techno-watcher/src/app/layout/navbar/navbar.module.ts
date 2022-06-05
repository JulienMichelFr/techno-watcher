import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { AuthComponent } from './components/auth/auth.component';
import { NavbarComponent } from './containers/navbar/navbar.component';

@NgModule({
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatInputModule, RouterModule, MatIconModule, MatMenuModule],
  declarations: [NavbarComponent, AuthComponent],
  exports: [NavbarComponent],
})
export class NavbarModule {}
