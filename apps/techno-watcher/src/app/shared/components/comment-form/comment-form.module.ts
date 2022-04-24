import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentFormComponent } from './comment-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [CommentFormComponent],
  imports: [CommonModule, MatCardModule, MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule],
  exports: [CommentFormComponent],
})
export class CommentFormModule {}
