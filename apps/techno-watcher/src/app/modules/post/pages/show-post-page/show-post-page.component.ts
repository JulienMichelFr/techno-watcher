import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, debounceTime, filter, map, Observable, switchMap, take } from 'rxjs';
import { AddCommentOnPostDto, CommentModel, PostModel } from '@techno-watcher/api-models';
import { PostService } from '../../../../services/post/post.service';
import { noop } from '../../../../shared/utils/noop';

@Component({
  selector: 'techno-watcher-show-post-page-page',
  templateUrl: './show-post-page.component.html',
  styleUrls: ['./show-post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowPostPageComponent {
  public readonly post$: Observable<PostModel>;
  public readonly comments$: Observable<CommentModel[]>;

  public addCommentLoading: boolean = false;
  public addCommentDto: AddCommentOnPostDto = new AddCommentOnPostDto();

  private readonly refreshCommentSubject: BehaviorSubject<null>;

  public constructor(private activatedRoute: ActivatedRoute, private postService: PostService) {
    this.refreshCommentSubject = new BehaviorSubject(null);
    this.post$ = this.getPost();
    this.comments$ = this.getComments();
  }

  public commentsTrackByFn(index: number, comment: CommentModel): number {
    return comment.id;
  }

  public handleNewComment(comment: AddCommentOnPostDto): void {
    this.addCommentLoading = true;
    this.getPostIdFromRoute()
      .pipe(
        take(1),
        switchMap((postId) => this.postService.addCommentOnPost(postId, comment))
      )
      .subscribe(
        () => {
          this.refreshCommentSubject.next(null);
          this.addCommentDto = new AddCommentOnPostDto();
        },
        noop,
        () => (this.addCommentLoading = false)
      );
  }

  public addCommentOnComment({ comment, commentId }: { commentId: number; comment: AddCommentOnPostDto }): void {
    this.getPostIdFromRoute()
      .pipe(
        take(1),
        switchMap((postId) => this.postService.addCommentOnCommentWithPostId(postId, commentId, comment))
      )
      .subscribe(() => {
        this.refreshCommentSubject.next(null);
      });
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
