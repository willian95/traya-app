import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

/**
 * Generated class for the ImageSliderModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image-slider-modal',
  templateUrl: 'image-slider-modal.html',
})
export class ImageSliderModalPage {

  @ViewChild(Slides) slides: Slides;

  secondaryImages:any = []

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.secondaryImages = this.navParams.get("secondaryImages")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageSliderModalPage');
  }

  closeModal(){
    this.navCtrl.pop();
  }

}
