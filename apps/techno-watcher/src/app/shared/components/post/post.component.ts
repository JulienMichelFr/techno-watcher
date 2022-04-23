import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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

  public trackByIndex(index: number): number {
    return index;
  }
}
