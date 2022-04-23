import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommentModel } from '@techno-watcher/api-models';

@Component({
  selector: 'techno-watcher-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListComponent implements OnChanges {
  @Input()
  public comments?: CommentModel[] | null;

  public filteredComments: CommentModel[] = [];

  public ngOnChanges({ comments }: SimpleChanges): void {
    this.filteredComments = ((comments?.currentValue as CommentModel[]) ?? []).filter((comment) => comment.parentCommentId === null);
  }

  public commentTrackByFn(index: number, comment: CommentModel): number {
    return comment.id;
  }
}
