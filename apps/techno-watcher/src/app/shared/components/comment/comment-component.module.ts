import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment.component';
import { DateAgoPipeModule } from '../../pipes/date-ago/date-ago-pipe.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ShowOnSignedInModule } from '../../directives/show-on-signed-in/show-on-signed-in.module';

@NgModule({
  declarations: [CommentComponent],
  imports: [CommonModule, DateAgoPipeModule, MatIconModule, MatButtonModule, MatCardModule, ShowOnSignedInModule],
  exports: [CommentComponent],
})
export class CommentComponentModule {}
