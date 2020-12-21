import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuickRequestPage } from './quick-request';

@NgModule({
  declarations: [
    QuickRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(QuickRequestPage),
  ],
  exports:[
    QuickRequestPage
  ]
})
export class QuickRequestPageModule {}
