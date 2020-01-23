import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserOpinionsPage } from './user-opinions';

@NgModule({
  declarations: [
    UserOpinionsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserOpinionsPage),
  ],
})
export class UserOpinionsPageModule {}
