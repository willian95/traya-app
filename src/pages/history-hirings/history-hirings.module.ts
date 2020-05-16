import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryHiringsPage } from './history-hirings';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    HistoryHiringsPage,
  ],
  imports: [
    StarRatingModule,
    IonicPageModule.forChild(HistoryHiringsPage),
  ],
  exports:[
    HistoryHiringsPage
  ]
})
export class HistoryHiringsPageModule {}
