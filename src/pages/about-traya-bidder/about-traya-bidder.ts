import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the AboutTrayaBidderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about-traya-bidder',
  templateUrl: 'about-traya-bidder.html',
})
export class AboutTrayaBidderPage {

  showBackButton:any

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {

    this.showBackButton = false
    let about_bidder = localStorage.getItem('about_band_bidder')

    if(about_bidder == "true"){
      this.showBackButton = true
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutTrayaBidderPage');
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
 dontSee() {
    localStorage.setItem('about_band_bidder','true');
    this.viewCtrl.dismiss();
  }
 
}
