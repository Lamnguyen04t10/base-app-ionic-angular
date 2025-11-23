import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { DemoPageRoutingModule } from './demo-routing.module';

import { DemoPage } from './demo.page';
import { UiFormModule } from 'src/app/ui-components/forms/ui-form-modules';
import { UiComponentsModule } from 'src/app/ui-components/ui-components-module';

@NgModule({
  imports: [CommonModule, UiFormModule, IonicModule, DemoPageRoutingModule, UiComponentsModule],
  declarations: [DemoPage],
})
export class DemoPageModule {}
