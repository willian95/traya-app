import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryHiringsPage } from './history-hirings';

@NgModule({
  declarations: [
    HistoryHiringsPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryHiringsPage),
  ],
})
export class HistoryHiringsPageModule {}
