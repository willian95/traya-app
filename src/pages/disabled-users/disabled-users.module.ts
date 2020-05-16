import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisabledUsersPage } from './disabled-users';

@NgModule({
  declarations: [
    DisabledUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(DisabledUsersPage),
  ],
  exports:[
    DisabledUsersPage
  ]
})
export class DisabledUsersPageModule {}
