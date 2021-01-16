import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageSliderModalPage } from './image-slider-modal';

@NgModule({
  declarations: [
    ImageSliderModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageSliderModalPage),
  ],
})
export class ImageSliderModalPageModule {}
