import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalInformationPage } from './modal-information';

@NgModule({
  declarations: [
    ModalInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalInformationPage),
  ],
  exports:[
    ModalInformationPage
  ]
})
export class ModalInformationPageModule {}
