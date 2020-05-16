import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersServicesPage } from './users-services';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    UsersServicesPage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(UsersServicesPage),
  ],
  exports:[
    UsersServicesPage
  ]
})
export class UsersServicesPageModule {}
