import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommentModel } from '@techno-watcher/api-models';

@Component({
  selector: 'techno-watcher-comment-with-subcomments',
  templateUrl: './comment-with-subcomments.component.html',
  styleUrls: ['./comment-with-subcomments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentWithSubcommentsComponent implements OnInit {
  @Input() public comment!: CommentModel;
  @Input() public comments!: CommentModel[];

  public filteredComments: CommentModel[] = [];
  public showComments: boolean = true;

  public ngOnInit(): void {
    this.filteredComments = this.comments.filter((comment) => comment.parentCommentId === this.comment.id);
  }

  public toggleComments(): void {
    this.showComments = !this.showComments;
  }

  public commentTrackByFn(index: number, comment: CommentModel): number {
    return comment.id;
  }
}
