import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeGuard } from '../guards/home.guard';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    canActivate: [HomeGuard],
    children: [
      {
        path: 'camera',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/camera/camera.module').then(
                m => m.CameraPageModule
              )
          }
        ]
      },
      {
        path: 'saved-products',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/saved-products/saved-products.module').then(
                m => m.SavedProductsPageModule
              )
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/settings/settings.module').then(
                m => m.SettingsPageModule
              )
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home/camera',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRouter {}
