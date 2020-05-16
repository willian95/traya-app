import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MaintenanceModePage } from './maintenance-mode';

@NgModule({
  declarations: [
    MaintenanceModePage,
  ],
  imports: [
    IonicPageModule.forChild(MaintenanceModePage),
  ],
  exports:[
    MaintenanceModePage
  ]
})
export class MaintenanceModePageModule {}
