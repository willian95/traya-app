import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailHiringNotificationPage } from './detail-hiring-notification';

@NgModule({
  declarations: [
    DetailHiringNotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailHiringNotificationPage),
  ],
  exports:[
    DetailHiringNotificationPage
  ]
})
export class DetailHiringNotificationPageModule {}
