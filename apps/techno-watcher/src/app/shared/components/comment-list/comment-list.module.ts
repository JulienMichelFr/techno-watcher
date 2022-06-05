import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ShowOnSignedInModule } from '../../directives/show-on-signed-in/show-on-signed-in.module';
import { CommentComponentModule } from '../comment/comment-component.module';
import { CommentFormModule } from '../comment-form/comment-form.module';

import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentWithSubcommentsComponent } from './components/comment-with-subcomments/comment-with-subcomments.component';

@NgModule({
  declarations: [CommentListComponent, CommentWithSubcommentsComponent],
  imports: [CommonModule, CommentComponentModule, MatIconModule, MatButtonModule, CommentFormModule, ShowOnSignedInModule],
  exports: [CommentListComponent],
})
export class CommentListModule {}
