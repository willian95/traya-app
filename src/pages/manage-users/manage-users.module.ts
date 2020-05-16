import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageUsersPage } from './manage-users';

@NgModule({
  declarations: [
    ManageUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageUsersPage),
  ],
  exports:[
    ManageUsersPage
  ]
})
export class ManageUsersPageModule {}
