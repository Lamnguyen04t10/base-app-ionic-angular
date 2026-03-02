import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthLayoutPageRoutingModule } from './auth-layout-routing.module';

import { AuthLayoutPage } from './auth-layout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthLayoutPageRoutingModule
  ],
  declarations: [AuthLayoutPage]
})
export class AuthLayoutPageModule {}
