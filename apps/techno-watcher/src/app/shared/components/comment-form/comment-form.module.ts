import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MarkdownInputComponentModule } from '../markdown-input/markdown-input.component';

import { CommentFormComponent } from './comment-form.component';

@NgModule({
  declarations: [CommentFormComponent],
  imports: [CommonModule, MatCardModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, MarkdownInputComponentModule],
  exports: [CommentFormComponent],
})
export class CommentFormModule {}
