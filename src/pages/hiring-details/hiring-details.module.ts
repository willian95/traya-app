import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HiringDetailsPage } from './hiring-details';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    HiringDetailsPage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(HiringDetailsPage),
  ],
  exports:[
    HiringDetailsPage
  ]
})
export class HiringDetailsPageModule {}
