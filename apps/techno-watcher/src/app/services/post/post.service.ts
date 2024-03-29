import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AddCommentOnPostDto, CommentModel, CreatePostDto, GetPostsDto, Paginated, PostModel } from '@techno-watcher/api-models';

import { ApiServiceBase } from '../../bases/api-service.base';
import { JWT_REQUIRED } from '../../constantes/jwt-required-http-context';

@Injectable({
  providedIn: 'root',
})
export class PostService extends ApiServiceBase<PostModel> {
  protected readonly baseUrl: string = `${this.apiUrl}/posts`;

  public findPosts(params: GetPostsDto): Observable<Paginated<PostModel>> {
    return this.http.get<Paginated<PostModel>>(this.baseUrl, {
      params: {
        ...params,
      },
      context: new HttpContext().set(JWT_REQUIRED, false),
    });
  }

  public findPostById(id: number): Observable<PostModel> {
    return this.findById(id, new HttpContext().set(JWT_REQUIRED, false));
  }

  public createPost(post: CreatePostDto): Observable<PostModel> {
    return this.create(post);
  }

  public findCommentsOnPost(postId: number): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>(`${this.baseUrl}/${postId}/comments`, {
      context: new HttpContext().set(JWT_REQUIRED, false),
    });
  }

  public addCommentOnPost(postId: number, comment: AddCommentOnPostDto): Observable<CommentModel> {
    return this.http.post<CommentModel>(`${this.baseUrl}/${postId}/comments`, comment);
  }

  public addCommentOnCommentWithPostId(postId: number, commentId: number, comment: AddCommentOnPostDto): Observable<CommentModel> {
    return this.http.post<CommentModel>(`${this.baseUrl}/${postId}/comments/${commentId}`, comment);
  }

  public deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${postId}`, {});
  }
}
