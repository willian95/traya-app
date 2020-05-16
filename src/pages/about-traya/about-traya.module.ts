import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutTrayaPage } from './about-traya';

@NgModule({
  declarations: [
    AboutTrayaPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutTrayaPage),
  ],
  exports:[
    AboutTrayaPage
  ]
})
export class AboutTrayaPageModule {}
