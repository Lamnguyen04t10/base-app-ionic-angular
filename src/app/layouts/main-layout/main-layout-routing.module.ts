import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainLayoutPage } from './main-layout.page';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutPage,
    children: [
      {
        path: 'demo',
        loadChildren: () => import('../../pages/demo/demo.module').then(m => m.DemoPageModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('../../pages/orders/orders.module').then(m => m.OrdersPageModule)
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainLayoutPageRoutingModule { }
