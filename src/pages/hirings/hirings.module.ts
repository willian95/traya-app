import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HiringsPage } from './hirings';

@NgModule({
  declarations: [
    HiringsPage,
  ],
  imports: [
    IonicPageModule.forChild(HiringsPage),
  ],
})
export class HiringsPageModule {}
