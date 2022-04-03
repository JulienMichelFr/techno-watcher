import { Injectable } from '@angular/core';
import { ApiServiceBase } from '../../bases/api-service.base';
import { Observable } from 'rxjs';
import {CreatePostDto, GetPostsDto, Paginated, PostModel} from '@techno-watcher/api-models';

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
    });
  }

  public findPostById(id: number): Observable<PostModel> {
    return this.findById(id);
  }

  public createPost(post: CreatePostDto): Observable<PostModel> {
    return this.create(post);
  }
}
