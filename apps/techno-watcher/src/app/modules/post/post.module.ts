import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PostDetailPageComponent} from "./pages/post-detail/post-detail-page.component";
import {PostRoutingModule} from "./post-routing.module";
import {PostComponentModule} from "../../shared/components/post/post-component.module";
import {CommentComponentModule} from "../../shared/components/comment/comment-component.module";

@NgModule({
  imports: [CommonModule, PostRoutingModule, PostComponentModule, CommentComponentModule],
  declarations: [PostDetailPageComponent],
  exports: [],
})
export class PostModule {
}
