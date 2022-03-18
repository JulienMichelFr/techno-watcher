import { Injectable } from '@angular/core';
import { ApiServiceBase } from '../../bases/api-service.base';
import { Observable } from 'rxjs';
import { CreatePostDto, GetPostsDto } from '@techno-watcher/api-models';

// TODO
export type Post = any;

@Injectable({
  providedIn: 'root',
})
export class PostService extends ApiServiceBase<Post> {
  protected readonly baseUrl: string = `${this.apiUrl}/posts`;

  public findPosts(params: GetPostsDto): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl, {
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
