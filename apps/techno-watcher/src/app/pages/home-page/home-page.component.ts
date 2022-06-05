import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, map, Observable, shareReplay, switchMap, tap } from 'rxjs';

import { Paginated, PostModel } from '@techno-watcher/api-models';

import { PostService } from '../../services/post/post.service';

@Component({
  selector: 'techno-watcher-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  public readonly pageSize: number = 10;
  public readonly posts$: Observable<PostModel[]>;
  public readonly total$: Observable<number>;
  public readonly loading$: Observable<boolean>;

  private readonly paginatedPosts$: Observable<Paginated<PostModel>>;
  private readonly pageSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  private readonly loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public constructor(private postService: PostService) {
    this.paginatedPosts$ = this.pageSubject.asObservable().pipe(
      switchMap((pageIndex) => this.getPaginatedPosts$(pageIndex)),
      shareReplay(1)
    );
    this.posts$ = this.paginatedPosts$.pipe(map(({ data }) => data));
    this.total$ = this.paginatedPosts$.pipe(map(({ total }) => total));
    this.loading$ = this.loadingSubject.asObservable();
  }

  public trackByFn(index: number, item: PostModel): number {
    return item.id;
  }

  public handlePageChange({ pageIndex }: PageEvent): void {
    this.pageSubject.next(pageIndex);
  }

  private getPaginatedPosts$(page: number): Observable<Paginated<PostModel>> {
    this.loadingSubject.next(true);
    return this.postService
      .findPosts({ sort: 'createdAt:asc', take: 10, skip: page * this.pageSize, tags: [] })
      .pipe(tap(() => this.loadingSubject.next(false)));
  }
}
