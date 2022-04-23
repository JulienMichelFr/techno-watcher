import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AddCommentOnPostDto, CommentModel } from '@techno-watcher/api-models';
import { PostService } from '../../../../services/post/post.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'techno-watcher-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent {
  @Input() public postId!: number | null | undefined;

  @Output() public readonly addComment: EventEmitter<CommentModel> = new EventEmitter<CommentModel>();

  @ViewChild('form') public form!: NgForm;

  public comment: AddCommentOnPostDto = new AddCommentOnPostDto();

  public constructor(private postService: PostService) {}

  public submit(comment: AddCommentOnPostDto): void {
    if (!this.postId) {
      return;
    }
    this.postService.addCommentOnPost(this.postId, comment).subscribe((comment: CommentModel) => {
      this.addComment.emit(comment);
      this.comment = new AddCommentOnPostDto();
      this.form.resetForm();
    });
  }
}
