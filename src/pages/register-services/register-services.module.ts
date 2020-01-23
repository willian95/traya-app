import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterServicesPage } from './register-services';

@NgModule({
  declarations: [
    RegisterServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterServicesPage),
  ],
})
export class RegisterServicesPageModule {}
