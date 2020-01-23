import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ToastController } from 'ionic-angular';

/**
 * Generated class for the TermsAndConditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public toastController: ToastController) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
  }

 closeModal() {
    this.viewCtrl.dismiss();
  
  }

  goBack(){
    this.navCtrl.pop();
  }

   
}
