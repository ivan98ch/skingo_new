import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SavedProductsPage } from './saved-products.page';
import { NamePagePipePipe } from '../../pipes/name-page-pipe.pipe';


const routes: Routes = [
  {
    path: '',
    component: SavedProductsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SavedProductsPage, NamePagePipePipe]
})
export class SavedProductsPageModule {}
