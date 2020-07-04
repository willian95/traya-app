import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoriteTabsPage } from './favorite-tabs';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    FavoriteTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(FavoriteTabsPage),
    SuperTabsModule,
  ],
})
export class FavoriteTabsPageModule {}
