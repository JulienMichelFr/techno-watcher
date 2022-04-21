import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagInputComponent } from './tag-input.component';
import {MatInputModule} from "@angular/material/input";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [TagInputComponent],
  imports: [CommonModule, MatInputModule, MatChipsModule, MatIconModule, FormsModule],
  exports: [TagInputComponent],
})
export class TagInputModule {}
