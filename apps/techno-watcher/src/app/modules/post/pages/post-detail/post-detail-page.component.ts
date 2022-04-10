import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {debounceTime, filter, Observable, pluck, switchMap} from 'rxjs';
import {CommentModel, PostModel} from '@techno-watcher/api-models';
import {PostService} from '../../../../services/post/post.service';

@Component({
  selector: 'techno-watcher-post-detail-page',
  templateUrl: './post-detail-page.component.html',
  styleUrls: ['./post-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailPageComponent {
  public post$: Observable<PostModel> = this.getPost();
  public comments$: Observable<CommentModel[] | undefined> = this.post$.pipe(
    pluck('comments'),
  )

  public constructor(private activatedRoute: ActivatedRoute, private postService: PostService) {
  }

  public commentsTrackByFn(index: number, comment: CommentModel): number {
    return comment.id;
  }

  private getPost(): Observable<PostModel> {
    return this.activatedRoute.paramMap.pipe(
      debounceTime(800),
      filter((params) => params.has('id')),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      switchMap((params) => this.postService.findPostById(parseInt(params.get('id')!)))
    );
  }
}
