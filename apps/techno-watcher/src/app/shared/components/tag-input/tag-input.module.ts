import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";

import { TagInputComponent } from './tag-input.component';

@NgModule({
  declarations: [TagInputComponent],
  imports: [CommonModule, MatInputModule, MatChipsModule, MatIconModule, FormsModule],
  exports: [TagInputComponent],
})
export class TagInputModule {}
