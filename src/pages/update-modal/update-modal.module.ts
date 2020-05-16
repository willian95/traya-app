import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateModalPage } from './update-modal';

@NgModule({
  declarations: [
    UpdateModalPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateModalPage),
  ],
  exports:[
    UpdateModalPage
  ]
})
export class UpdateModalPageModule {}
