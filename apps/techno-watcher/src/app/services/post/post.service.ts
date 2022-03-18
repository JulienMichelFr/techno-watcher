import { Injectable } from '@angular/core';
import { ApiServiceBase } from '../../bases/api-service.base';
import { Observable } from 'rxjs';
import { CreatePostDto, GetPostsDto, Paginated } from '@techno-watcher/api-models';
import type { Post as PostEntity, User } from '@prisma/client';

// TODO
export type Post = PostEntity & { author: User } & { _count: { comments: number } };

@Injectable({
  providedIn: 'root',
})
export class PostService extends ApiServiceBase<Post> {
  protected readonly baseUrl: string = `${this.apiUrl}/posts`;

  public findPosts(params: GetPostsDto): Observable<Paginated<Post>> {
    return this.http.get<Paginated<Post>>(this.baseUrl, {
      params: {
        ...params,
      },
    });
  }

  public findPostById(id: number): Observable<Post> {
    return this.findById(id);
  }

  public createPost(post: CreatePostDto): Observable<Post> {
    return this.create(post);
  }
}
