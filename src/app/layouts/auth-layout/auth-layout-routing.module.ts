import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutPage } from './auth-layout.page';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthLayoutPageRoutingModule {}
