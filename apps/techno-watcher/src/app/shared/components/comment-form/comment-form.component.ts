import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AddCommentOnPostDto } from '@techno-watcher/api-models';

@Component({
  selector: 'techno-watcher-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent implements OnChanges {
  @Input() public comment: AddCommentOnPostDto = new AddCommentOnPostDto();
  @Input() public isLoading: boolean = false;

  @ViewChild('form') public form?: NgForm;

  @Output() public readonly addComment: EventEmitter<AddCommentOnPostDto> = new EventEmitter<AddCommentOnPostDto>();

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['comment']?.currentValue && this.form) {
      this.form.resetForm();
    }
  }

  public submit(comment: AddCommentOnPostDto): void {
    this.addComment.emit(comment);
  }
}
