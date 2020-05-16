import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutTrayaBidderPage } from './about-traya-bidder';

@NgModule({
  declarations: [
    AboutTrayaBidderPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutTrayaBidderPage),
  ],
  exports:[
    AboutTrayaBidderPage
  ]
})
export class AboutTrayaBidderPageModule {}
