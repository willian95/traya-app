import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, ToastController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public toastController: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutModalPage');
  }

   closeModal() {
    this.viewCtrl.dismiss();
    if (localStorage.getItem('valueServices') !=null) {
      if(window.localStorage.getItem('terms') == 'true'){
        this.toastTweet();
      }
      window.localStorage.removeItem('valueServices');
    }
  }
 dontSee() {
    localStorage.setItem('about_band','true');
    localStorage.setItem('about_band_bidder','true');
    this.viewCtrl.dismiss();
    if (localStorage.getItem('valueServices') !=null) {
      if(window.localStorage.getItem('terms') == 'true'){
        this.toastTweet();
      }
     window.localStorage.removeItem('valueServices');
    }
  }

  async toastTweet() {

    let rol_id = localStorage.getItem("user_rol")
    
    if(rol_id != "3"){
      var notification = window.localStorage.getItem('location_description')
      //console.log("test-rolId", rol_id, notification)
      if(notification != "null"){
        const toast = await this.toastController.create({
          message: notification,
          showCloseButton: true,
          closeButtonText: 'Cerrar',
          cssClass: 'your-toast-css-class'
        });
        toast.present();
      }
    }
    
    
  }
 

}
