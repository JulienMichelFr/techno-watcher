import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PostSourcePipe } from './post-source.pipe';

@NgModule({
  declarations: [PostSourcePipe],
  imports: [CommonModule],
  exports: [PostSourcePipe],
})
export class PostSourcePipeModule {}
