import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, debounceTime, filter, map, Observable, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { AddCommentOnPostDto, CommentModel, PostModel } from '@techno-watcher/api-models';
import { PostService } from '../../../../services/post/post.service';
import { noop } from '../../../../shared/utils/noop';
import { AuthFacade } from '../../../../+state/auth/auth.facade';

@Component({
  selector: 'techno-watcher-show-post-page-page',
  templateUrl: './show-post-page.component.html',
  styleUrls: ['./show-post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowPostPageComponent {
  public readonly post$: Observable<PostModel>;
  public readonly comments$: Observable<CommentModel[]>;
  public readonly canDelete$: Observable<boolean>;

  public addCommentLoading: boolean = false;
  public addCommentDto: AddCommentOnPostDto = new AddCommentOnPostDto();

  private readonly refreshCommentSubject: BehaviorSubject<null>;

  public constructor(private activatedRoute: ActivatedRoute, private postService: PostService, private authFacade: AuthFacade, private router: Router) {
    this.refreshCommentSubject = new BehaviorSubject(null);
    this.post$ = this.getPost();
    this.comments$ = this.getComments();
    this.canDelete$ = this.post$.pipe(
      withLatestFrom(this.authFacade.profile$),
      map(([post, profile]) => post.author.username === profile?.username)
    );
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

  public deletePost(): void {
    this.getPostIdFromRoute()
      .pipe(
        take(1),
        switchMap((postId) => this.postService.deletePost(postId)),
        tap(() => this.router.navigate(['/']))
      )
      .subscribe();
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
