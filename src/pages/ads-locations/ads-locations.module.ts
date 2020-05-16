import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdsLocationsPage } from './ads-locations';

@NgModule({
  declarations: [
    AdsLocationsPage,
  ],
  imports: [
    IonicPageModule.forChild(AdsLocationsPage),
  ],
})
export class AdsLocationsPageModule {}
