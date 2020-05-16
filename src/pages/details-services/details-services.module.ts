import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsServicesPage } from './details-services';

@NgModule({
  declarations: [
    DetailsServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsServicesPage),
  ],
  exports:[
    DetailsServicesPage
  ]
})
export class DetailsServicesPageModule {}
