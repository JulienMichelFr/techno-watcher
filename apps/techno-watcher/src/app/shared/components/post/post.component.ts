import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post } from '../../../services/post/post.service';

@Component({
  selector: 'techno-watcher-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  @Input() public post!: Post;

  public trackByIndex(index: number): number {
    return index;
  }
}
