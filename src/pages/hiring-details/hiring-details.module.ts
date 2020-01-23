import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HiringDetailsPage } from './hiring-details';

@NgModule({
  declarations: [
    HiringDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(HiringDetailsPage),
  ],
})
export class HiringDetailsPageModule {}
