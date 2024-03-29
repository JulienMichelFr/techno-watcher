import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ShowOnSignedInDirective } from './show-on-signed-in.directive';

@NgModule({
  declarations: [ShowOnSignedInDirective],
  imports: [CommonModule],
  exports: [ShowOnSignedInDirective],
})
export class ShowOnSignedInModule {}
