import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicesJobPage } from './services-job';

@NgModule({
  declarations: [
    ServicesJobPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicesJobPage),
  ],
  exports:[
    ServicesJobPage
  ]
})
export class ServicesJobPageModule {}
