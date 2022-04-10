import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PostDetailPageComponent} from "./pages/post-detail/post-detail-page.component";
import {PostRoutingModule} from "./post-routing.module";
import {PostComponentModule} from "../../shared/components/post/post-component.module";

@NgModule({
  imports: [CommonModule, PostRoutingModule, PostComponentModule],
  declarations: [PostDetailPageComponent],
  exports: [],
})
export class PostModule {
}
