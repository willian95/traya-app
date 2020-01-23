import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserHiringPage } from './user-hiring';
import { SuperTabsModule } from 'ionic2-super-tabs'
@NgModule({
  declarations: [
    UserHiringPage,
  ],
  imports: [
    IonicPageModule.forChild(UserHiringPage),
     SuperTabsModule,
  ],
})
export class UserHiringPageModule {}
