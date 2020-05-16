import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserHiringPage } from './user-hiring';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    UserHiringPage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(UserHiringPage),
     SuperTabsModule,
  ],
  exports:[
    UserHiringPage
  ]
})
export class UserHiringPageModule {}
