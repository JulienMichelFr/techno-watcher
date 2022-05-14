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

  @Output() public readonly reply: EventEmitter<void> = new EventEmitter<void>();

  public showComments: boolean = true;

  public toggleComments(): void {
    this.showComments = !this.showComments;
  }

  public emitReply(): void {
    this.reply.emit();
  }
}
