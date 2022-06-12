import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CommentComponentModule } from '../../shared/components/comment/comment-component.module';
import { CommentFormModule } from '../../shared/components/comment-form/comment-form.module';
import { CommentListModule } from '../../shared/components/comment-list/comment-list.module';
import { MarkdownInputComponentModule } from '../../shared/components/markdown-input/markdown-input.component';
import { MarkdownRendererComponentModule } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { PostComponentModule } from '../../shared/components/post/post-component.module';
import { TagInputModule } from '../../shared/components/tag-input/tag-input.module';
import { ShowOnSignedInModule } from '../../shared/directives/show-on-signed-in/show-on-signed-in.module';
import { UrlValidatorDirectiveModule } from '../../shared/validators/url-validator-directive/url-validator-directive.module';

import { CreatePostPageComponent } from './pages/create-post-page/create-post-page.component';
import { ShowPostPageComponent } from './pages/show-post-page/show-post-page.component';
import { PostRoutingModule } from './post-routing.module';

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
    MarkdownInputComponentModule,
    MarkdownRendererComponentModule,
  ],
  declarations: [ShowPostPageComponent, CreatePostPageComponent],
  exports: [],
})
export class PostModule {}
