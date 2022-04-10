import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';

const Routes: Route[] = [
  { path: '', component: HomePageComponent },
  { path: 'posts', loadChildren: () => import('./modules/post/post.module').then(m => m.PostModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(Routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
