import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailsLocalityPage } from './details-locality';

@NgModule({
  declarations: [
    DetailsLocalityPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailsLocalityPage),
  ],
  exports:[
    DetailsLocalityPage
  ]
})
export class DetailsLocalityPageModule {}
