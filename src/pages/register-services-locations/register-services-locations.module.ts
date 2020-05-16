import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterServicesLocationsPage } from './register-services-locations';

@NgModule({
  declarations: [
    RegisterServicesLocationsPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterServicesLocationsPage),
  ],
})
export class RegisterServicesLocationsPageModule {}
