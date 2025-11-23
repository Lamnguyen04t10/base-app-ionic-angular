import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormModule } from './forms/ui-form-modules';
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule, UiFormModule],
  exports: [UiFormModule, CardComponent],
})
export class UiComponentsModule {}
