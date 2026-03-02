import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then((m) => m.AuthLayoutPageModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./layouts/main-layout/main-layout.module').then((m) => m.MainLayoutPageModule),
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then((m) => m.FolderPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
