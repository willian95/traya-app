import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController   } from 'ionic-angular';

/**
 * Generated class for the UpdateModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-modal',
  templateUrl: 'update-modal.html',
})
export class UpdateModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateModalPage');
  }

   closeModal() {
    this.viewCtrl.dismiss();
    window.location.href="market://details?id=com.ionicframework.traya";
  
  }
 dontSee() {
    localStorage.setItem('UpdateAPK','true');
    this.viewCtrl.dismiss();
  }
 

}
