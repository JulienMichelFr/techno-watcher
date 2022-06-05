import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { AddCommentOnPostDto, CommentModel } from '@techno-watcher/api-models';

@Component({
  selector: 'techno-watcher-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListComponent implements OnChanges {
  @Input()
  public comments?: CommentModel[] | null;
  @Input()
  public username: string | null = null;

  @Output() public readonly addComment: EventEmitter<{ commentId: number; comment: AddCommentOnPostDto }> = new EventEmitter<{
    commentId: number;
    comment: AddCommentOnPostDto;
  }>();
  @Output() public readonly deleteComment: EventEmitter<number> = new EventEmitter<number>();

  public filteredComments: CommentModel[] = [];

  public ngOnChanges({ comments }: SimpleChanges): void {
    this.filteredComments = ((comments?.currentValue as CommentModel[]) ?? []).filter((comment) => comment.parentCommentId === null);
  }

  public commentTrackByFn(index: number, comment: CommentModel): number {
    return comment.id;
  }

  public emitAddComment(event: { commentId: number; comment: AddCommentOnPostDto }): void {
    this.addComment.emit(event);
  }

  public onDeleteComment(commentId: number): void {
    this.deleteComment.emit(commentId);
  }
}
