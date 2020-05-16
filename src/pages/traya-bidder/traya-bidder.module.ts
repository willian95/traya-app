import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrayaBidderPage } from './traya-bidder';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    TrayaBidderPage,
  ],
  imports: [
    IonicPageModule.forChild(TrayaBidderPage),
    SuperTabsModule,
  ],
  exports:[
    TrayaBidderPage
  ]
})
export class TrayaBidderPageModule {}
