import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainLayoutPageRoutingModule } from './main-layout-routing.module';

import { MainLayoutPage } from './main-layout.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    MainLayoutPageRoutingModule
  ],
  declarations: [MainLayoutPage]
})
export class MainLayoutPageModule {}
