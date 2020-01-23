import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersServicesPage } from './users-services';

@NgModule({
  declarations: [
    UsersServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(UsersServicesPage),
  ],
})
export class UsersServicesPageModule {}
