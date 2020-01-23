import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateLocalityPage } from './create-locality';

@NgModule({
  declarations: [
    CreateLocalityPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateLocalityPage),
  ],
})
export class CreateLocalityPageModule {}
