import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrayaPage } from './traya';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    TrayaPage,
  ],
  imports: [
    IonicPageModule.forChild(TrayaPage),
    SuperTabsModule,
  ],
})
export class TrayaPageModule {}
