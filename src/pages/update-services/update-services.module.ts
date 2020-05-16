import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateServicesPage } from './update-services';

@NgModule({
  declarations: [
    UpdateServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateServicesPage),
  ],
  exports:[
    UpdateServicesPage
  ]
})
export class UpdateServicesPageModule {}
