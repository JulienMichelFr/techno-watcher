import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowPostPageComponent } from './pages/show-post-page/show-post-page.component';
import { PostRoutingModule } from './post-routing.module';
import { PostComponentModule } from '../../shared/components/post/post-component.module';
import { CommentComponentModule } from '../../shared/components/comment/comment-component.module';
import { CreatePostPageComponent } from './pages/create-post-page/create-post-page.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TagInputModule } from '../../shared/components/tag-input/tag-input.module';
import { ShowOnSignedInModule } from '../../shared/directives/show-on-signed-in/show-on-signed-in.module';
import { CommentListModule } from '../../shared/components/comment-list/comment-list.module';
import { CommentFormModule } from '../../shared/components/comment-form/comment-form.module';
import { UrlValidatorDirectiveModule } from '../../shared/validators/url-validator-directive/url-validator-directive.module';

@NgModule({
  imports: [
    CommonModule,
    PostRoutingModule,
    PostComponentModule,
    CommentComponentModule,
    MatCardModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TagInputModule,
    ShowOnSignedInModule,
    CommentListModule,
    CommentFormModule,
    UrlValidatorDirectiveModule,
  ],
  declarations: [ShowPostPageComponent, CreatePostPageComponent],
  exports: [],
})
export class PostModule {}
