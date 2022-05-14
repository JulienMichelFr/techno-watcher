import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentComponentModule } from '../comment/comment-component.module';
import { CommentWithSubcommentsComponent } from './components/comment-with-subcomments/comment-with-subcomments.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommentFormModule } from '../comment-form/comment-form.module';
import { ShowOnSignedInModule } from '../../directives/show-on-signed-in/show-on-signed-in.module';

@NgModule({
  declarations: [CommentListComponent, CommentWithSubcommentsComponent],
  imports: [CommonModule, CommentComponentModule, MatIconModule, MatButtonModule, CommentFormModule, ShowOnSignedInModule],
  exports: [CommentListComponent],
})
export class CommentListModule {}
