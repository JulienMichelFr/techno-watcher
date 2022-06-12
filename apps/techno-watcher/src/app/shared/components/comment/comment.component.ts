import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CommentModel } from '@techno-watcher/api-models';

@Component({
  selector: 'techno-watcher-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  @Input() public comment?: CommentModel;
  @Input() public username: string | null = null;
  @Input() public disableAddComment: boolean | null = false;

  @Output() public readonly deleteComment: EventEmitter<number> = new EventEmitter<number>();
  @Output() public readonly reply: EventEmitter<void> = new EventEmitter<void>();

  public emitReply(): void {
    this.reply.emit();
  }

  public emitDelete(): void {
    if (this.comment?.id && confirm(`Are you sure you want to delete this comment ?`)) {
      this.deleteComment.emit(this.comment.id);
    }
  }
}
