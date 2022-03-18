import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post.component';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { TagComponentModule } from '../tag/tag-component.module';

@NgModule({
  declarations: [PostComponent],
  imports: [CommonModule, MatIconModule, MatBadgeModule, TagComponentModule],
  exports: [PostComponent],
})
export class PostComponentModule {}
