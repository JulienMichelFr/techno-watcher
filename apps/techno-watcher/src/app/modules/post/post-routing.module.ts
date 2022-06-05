import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CreatePostPageComponent} from "./pages/create-post-page/create-post-page.component";
import {ShowPostPageComponent} from './pages/show-post-page/show-post-page.component';

const routes: Routes = [
  { path: 'new', component: CreatePostPageComponent },
  { path: ':id', component: ShowPostPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostRoutingModule {}
