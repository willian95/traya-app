import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminAdsPage } from './admin-ads';

@NgModule({
  declarations: [
    AdminAdsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminAdsPage),
  ],
})
export class AdminAdsPageModule {}
