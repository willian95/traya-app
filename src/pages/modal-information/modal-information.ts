import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalInformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-information',
  templateUrl: 'modal-information.html',
})
export class ModalInformationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalInformationPage');
  }

   closeModal() {
    this.viewCtrl.dismiss();
  }
 dontSee() {
    localStorage.setItem('bidder_on','true');
    this.viewCtrl.dismiss();
  }

}
