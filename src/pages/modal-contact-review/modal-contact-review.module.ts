import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalContactReviewPage } from './modal-contact-review';

@NgModule({
  declarations: [
    ModalContactReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalContactReviewPage),
  ],
})
export class ModalContactReviewPageModule {}
