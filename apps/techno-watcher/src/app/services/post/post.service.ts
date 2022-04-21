import { Injectable } from '@angular/core';
import { ApiServiceBase } from '../../bases/api-service.base';
import { map, Observable } from 'rxjs';
import { CreatePostDto, GetPostsDto, Paginated, PostModel } from '@techno-watcher/api-models';
import { HttpContext } from '@angular/common/http';
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
    return this.findById(id, new HttpContext().set(JWT_REQUIRED, false)).pipe(
      map((post: PostModel) => {
        if (!post.comments?.length) {
          return post;
        }
        post.comments = post.comments.map((comment) => {
          comment.comments = post.comments?.filter((c) => c.parentCommentId === comment.id) ?? null;
          return comment;
        });
        return post;
      })
    );
  }

  public createPost(post: CreatePostDto): Observable<PostModel> {
    return this.create(post);
  }
}
