import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutTrayaBidderMenuPage } from './about-traya-bidder-menu';

@NgModule({
  declarations: [
    AboutTrayaBidderMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutTrayaBidderMenuPage),
  ],
  exports:[
    AboutTrayaBidderMenuPage
  ]
})
export class AboutTrayaBidderMenuPageModule {}
