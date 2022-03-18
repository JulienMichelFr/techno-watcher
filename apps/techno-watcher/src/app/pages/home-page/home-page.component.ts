import { Component } from '@angular/core';
import { Post, PostService } from '../../services/post/post.service';
import { map, Observable } from 'rxjs';
import { Paginated } from '@techno-watcher/api-models';

@Component({
  selector: 'techno-watcher-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  private paginatedPosts$: Observable<Paginated<Post>> = this.postService.findPosts({ sort: 'createdAt:asc', take: 10, skip: 0, tags: [] });

  public posts$: Observable<Post[]> = this.paginatedPosts$.pipe(map(({ data }) => data));

  public constructor(private postService: PostService) {}

  public trackByFn(index: number, item: Post): number {
    return item.id;
  }
}
