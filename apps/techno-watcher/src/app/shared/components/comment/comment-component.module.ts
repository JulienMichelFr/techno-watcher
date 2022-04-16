import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment.component';
import { DateAgoModule } from '../../pipes/date-ago/date-ago.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [CommentComponent],
  imports: [CommonModule, DateAgoModule, MatIconModule, MatButtonModule, MatCardModule],
  exports: [CommentComponent],
})
export class CommentComponentModule {}
