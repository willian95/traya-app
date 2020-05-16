import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HiringsPage } from './hirings';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    HiringsPage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(HiringsPage),
  ],
  exports:[
    HiringsPage
  ]
})
export class HiringsPageModule {}
