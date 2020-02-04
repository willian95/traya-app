import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController   } from 'ionic-angular';

/**
 * Generated class for the AboutModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about-modal',
  templateUrl: 'about-modal.html',
})
export class AboutModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutModalPage');
  }

   closeModal() {
    this.viewCtrl.dismiss();
  }
 dontSee() {
    localStorage.setItem('about_band','true');
    localStorage.setItem('about_band_bidder','true');
    this.viewCtrl.dismiss();
  }
 

}
