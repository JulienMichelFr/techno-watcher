import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UrlValidatorDirective } from './url-validator.directive';

@NgModule({
  declarations: [UrlValidatorDirective],
  imports: [CommonModule],
  exports: [UrlValidatorDirective],
})
export class UrlValidatorDirectiveModule {}
