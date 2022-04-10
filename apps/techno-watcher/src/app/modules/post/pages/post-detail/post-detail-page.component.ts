import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, filter, Observable, switchMap } from 'rxjs';
import { PostModel } from '@techno-watcher/api-models';
import { PostService } from '../../../../services/post/post.service';

@Component({
  selector: 'techno-watcher-post-detail-page',
  templateUrl: './post-detail-page.component.html',
  styleUrls: ['./post-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDetailPageComponent {
  public post$: Observable<PostModel>;

  public constructor(private activatedRoute: ActivatedRoute, private postService: PostService) {
    this.post$ = this.getPost();
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
