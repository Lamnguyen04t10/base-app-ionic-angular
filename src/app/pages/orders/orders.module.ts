import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import { UiComponentsModule } from 'src/app/ui-components/ui-components-module';
import { BasePaginationTableComponent } from 'src/app/ui-components/table/base-pagination-table/base-pagination-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UiComponentsModule,
    BasePaginationTableComponent,
    OrdersPageRoutingModule
  ],
  declarations: [OrdersPage]
})
export class OrdersPageModule {}
