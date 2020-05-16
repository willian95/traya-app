import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeAdminPage } from './home-admin';

@NgModule({
  declarations: [
    HomeAdminPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeAdminPage),
  ],
  exports:[
    HomeAdminPage
  ]
})
export class HomeAdminPageModule {}
