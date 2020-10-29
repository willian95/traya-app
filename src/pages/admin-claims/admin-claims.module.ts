import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminClaimsPage } from './admin-claims';

@NgModule({
  declarations: [
    AdminClaimsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminClaimsPage),
  ],
})
export class AdminClaimsPageModule {}
