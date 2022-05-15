import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AddCommentOnPostDto, CommentModel } from '@techno-watcher/api-models';

@Component({
  selector: 'techno-watcher-comment-with-subcomments',
  templateUrl: './comment-with-subcomments.component.html',
  styleUrls: ['./comment-with-subcomments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentWithSubcommentsComponent implements OnChanges {
  @Input() public comment!: CommentModel;
  @Input() public comments!: CommentModel[];
  @Input() public username: string | null = null;
  @Input() public disableAddComment?: boolean | null = false;

  @Output() public readonly addComment: EventEmitter<{ commentId: number; comment: AddCommentOnPostDto }> = new EventEmitter<{
    commentId: number;
    comment: AddCommentOnPostDto;
  }>();

  @Output() public readonly deleteComment: EventEmitter<number> = new EventEmitter<number>();

  public filteredComments: CommentModel[] = [];
  public showComments: boolean = true;
  public commentForm: AddCommentOnPostDto = new AddCommentOnPostDto();
  public showCommentForm: boolean = false;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['comments']) {
      this.filteredComments = this.comments.filter((comment) => comment.parentCommentId === this.comment.id);
    }
  }

  public toggleComments(): void {
    this.showComments = !this.showComments;
  }

  public toggleCommentForm(): void {
    this.showCommentForm = !this.showCommentForm;
  }

  public commentTrackByFn(index: number, comment: CommentModel): number {
    return comment.id;
  }

  public submitComment(comment: AddCommentOnPostDto): void {
    this.addComment.emit({ comment, commentId: this.comment.id });
    this.commentForm = new AddCommentOnPostDto();
    this.toggleCommentForm();
  }

  public onDeleteComment(commentId: number): void {
    this.deleteComment.emit(commentId);
  }
}
