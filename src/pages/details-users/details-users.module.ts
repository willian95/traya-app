import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsUsersPage } from './details-users';

@NgModule({
  declarations: [
    DetailsUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsUsersPage),
  ],
})
export class DetailsUsersPageModule {}
