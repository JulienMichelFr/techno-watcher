import { Component } from '@angular/core';
import { Post, PostService } from '../../services/post/post.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'techno-watcher-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  public posts$: Observable<Post[]> = this.postService.findPosts({ sort: 'createdAt:asc', take: 10, skip: 0, tags: [] });

  public constructor(private postService: PostService) {}
}
