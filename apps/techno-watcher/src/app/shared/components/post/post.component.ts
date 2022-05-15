import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PostModel } from '@techno-watcher/api-models';

@Component({
  selector: 'techno-watcher-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  @Input() public post: PostModel | null = null;
  @Input() public showContent: boolean = true;
  @Input() public canDelete: boolean | null = false;

  @Output() public readonly delete: EventEmitter<void> = new EventEmitter<void>();

  public trackByIndex(index: number): number {
    return index;
  }

  public onDelete(): void {
    this.delete.emit();
  }
}
