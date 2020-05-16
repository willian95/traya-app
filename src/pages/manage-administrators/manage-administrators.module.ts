import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageAdministratorsPage } from './manage-administrators';

@NgModule({
  declarations: [
    ManageAdministratorsPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageAdministratorsPage),
  ],
  exports:[
    ManageAdministratorsPage
  ]
})
export class ManageAdministratorsPageModule {}
