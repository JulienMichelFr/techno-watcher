import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, debounceTime, filter, map, Observable, switchMap } from 'rxjs';
import { CommentModel, PostModel } from '@techno-watcher/api-models';
import { PostService } from '../../../../services/post/post.service';

@Component({
  selector: 'techno-watcher-show-post-page-page',
  templateUrl: './show-post-page.component.html',
  styleUrls: ['./show-post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowPostPageComponent {
  public readonly post$: Observable<PostModel>;
  public readonly comments$: Observable<CommentModel[]>;
  private readonly refreshCommentSubject: BehaviorSubject<null>;

  public constructor(private activatedRoute: ActivatedRoute, private postService: PostService) {
    this.refreshCommentSubject = new BehaviorSubject(null);
    this.post$ = this.getPost();
    this.comments$ = this.getComments();
  }

  public commentsTrackByFn(index: number, comment: CommentModel): number {
    return comment.id;
  }

  public handleNewComment(): void {
    this.refreshCommentSubject.next(null);
  }

  private getPost(): Observable<PostModel> {
    return this.getPostIdFromRoute().pipe(switchMap((postId) => this.postService.findPostById(postId)));
  }

  private getComments(): Observable<CommentModel[]> {
    return combineLatest([this.getPostIdFromRoute(), this.refreshCommentSubject.asObservable()]).pipe(
      switchMap(([postId]) => this.postService.findCommentsOnPost(postId))
    );
  }

  private getPostIdFromRoute(): Observable<number> {
    return this.activatedRoute.paramMap.pipe(
      debounceTime(800),
      filter((params) => params.has('id')),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      map((params) => parseInt(params.get('id')!))
    );
  }
}
