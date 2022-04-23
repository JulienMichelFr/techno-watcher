import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentComponentModule } from '../comment/comment-component.module';
import { CommentWithSubcommentsComponent } from './components/comment-with-subcomments/comment-with-subcomments.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [CommentListComponent, CommentWithSubcommentsComponent],
  imports: [CommonModule, CommentComponentModule, MatIconModule, MatButtonModule],
  exports: [CommentListComponent],
})
export class CommentListModule {}
