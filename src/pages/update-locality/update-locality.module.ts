import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateLocalityPage } from './update-locality';

@NgModule({
  declarations: [
    UpdateLocalityPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateLocalityPage),
  ],
  exports:[
    UpdateLocalityPage
  ]
})
export class UpdateLocalityPageModule {}
