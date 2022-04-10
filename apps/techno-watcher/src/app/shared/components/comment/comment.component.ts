import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommentModel} from "@techno-watcher/api-models";

@Component({
  selector: 'techno-watcher-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
  @Input() public comment!: CommentModel;

  public showComments: boolean = true;

  public commentTrackByFn(index: number, comment: CommentModel): number {
    return comment.id;
  }

  public toggleComments(): void {
    this.showComments = !this.showComments;
  }
}
