import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post.component';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { TagComponentModule } from '../tag/tag-component.module';
import { DateAgoPipeModule } from '../../pipes/date-ago/date-ago-pipe.module';
import { MatCardModule } from '@angular/material/card';
import { PostSourcePipeModule } from '../../pipes/post-source/post-source-pipe.module';

@NgModule({
  declarations: [PostComponent],
  imports: [CommonModule, MatIconModule, MatBadgeModule, TagComponentModule, DateAgoPipeModule, MatCardModule, PostSourcePipeModule],
  exports: [PostComponent],
})
export class PostComponentModule {}
