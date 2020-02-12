import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoogleLocationPage } from './google-location';

@NgModule({
  declarations: [
    GoogleLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(GoogleLocationPage),
  ],
})
export class GoogleLocationPageModule {}
