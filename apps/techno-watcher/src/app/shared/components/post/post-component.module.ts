import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { DateAgoPipeModule } from '../../pipes/date-ago/date-ago-pipe.module';
import { PostSourcePipeModule } from '../../pipes/post-source/post-source-pipe.module';
import { TagComponentModule } from '../tag/tag-component.module';

import { PostComponent } from './post.component';

@NgModule({
  declarations: [PostComponent],
  imports: [CommonModule, MatIconModule, MatBadgeModule, TagComponentModule, DateAgoPipeModule, MatCardModule, PostSourcePipeModule, MatButtonModule],
  exports: [PostComponent],
})
export class PostComponentModule {}
