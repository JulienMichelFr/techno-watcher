import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PostService} from '../../services/post/post.service';
import {map, Observable} from 'rxjs';
import {Paginated, PostModel} from '@techno-watcher/api-models';

@Component({
  selector: 'techno-watcher-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  private paginatedPosts$: Observable<Paginated<PostModel>> = this.postService.findPosts({ sort: 'createdAt:asc', take: 10, skip: 0, tags: [] });

  public posts$: Observable<PostModel[]> = this.paginatedPosts$.pipe(map(({ data }) => data));

  public constructor(private postService: PostService) {}

  public trackByFn(index: number, item: PostModel): number {
    return item.id;
  }
}
