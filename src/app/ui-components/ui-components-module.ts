import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormModule } from './forms/ui-form-modules';
import { CardComponent } from './card/card.component';
import { PageTitleComponent } from '../components/page-title/page-title.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CardComponent, PageTitleComponent],
  imports: [CommonModule, UiFormModule, TranslateModule, ],
  exports: [UiFormModule, CardComponent, TranslateModule, PageTitleComponent],
})
export class UiComponentsModule { }
