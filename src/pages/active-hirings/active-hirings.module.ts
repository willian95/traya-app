import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActiveHiringsPage } from './active-hirings';

@NgModule({
  declarations: [
    ActiveHiringsPage,
  ],
  imports: [
    IonicPageModule.forChild(ActiveHiringsPage),
  ],
  exports:[
    ActiveHiringsPage
  ]
})
export class ActiveHiringsPageModule {}
