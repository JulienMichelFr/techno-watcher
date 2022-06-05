import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from "@angular/router";

import {CreatePostDto} from "@techno-watcher/api-models";

import {PostService} from "../../../../services/post/post.service";

@Component({
  selector: 'techno-watcher-create-post-page',
  templateUrl: './create-post-page.component.html',
  styleUrls: ['./create-post-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePostPageComponent {

  public post: CreatePostDto = new CreatePostDto();

  public constructor(private postService: PostService, private router: Router) {
  }

  public submit(post: CreatePostDto): void {
    this.postService.createPost(post).subscribe(({id}) => {
      this.router.navigate(['/posts', id]);
    });
  }

}
