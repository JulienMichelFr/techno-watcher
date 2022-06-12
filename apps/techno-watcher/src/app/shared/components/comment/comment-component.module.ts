import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ShowOnSignedInModule } from '../../directives/show-on-signed-in/show-on-signed-in.module';
import { DateAgoPipeModule } from '../../pipes/date-ago/date-ago-pipe.module';
import { MarkdownRendererComponentModule } from '../markdown-renderer/markdown-renderer.component';

import { CommentComponent } from './comment.component';

@NgModule({
  declarations: [CommentComponent],
  imports: [CommonModule, DateAgoPipeModule, MatIconModule, MatButtonModule, MatCardModule, ShowOnSignedInModule, MarkdownRendererComponentModule],
  exports: [CommentComponent],
})
export class CommentComponentModule {}
