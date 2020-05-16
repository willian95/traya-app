import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ToastController,ModalController } from 'ionic-angular';
import { TermsPage } from '../terms/terms'; //importo el modal

/**
 * Generated class for the TermsAndConditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terms-and-conditions',
  templateUrl: 'terms-and-conditions.html',
})
export class TermsAndConditionsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public toastController: ToastController,  public modalCtrl: ModalController) {
  }
  message:any;
  terms:any;

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsAndConditionsPage');
  }


  acceptTerms() {
    if (this.terms == true) {
      var terms='true';
      localStorage.setItem('terms',terms);
       this.viewCtrl.dismiss();
       this.toastTweet()
    }else{
      this.message="Debe aceptar los Términos y Condiciones para continuar."
      this.alert(this.message);
    }
  }

  goBack(){
    this.navCtrl.pop();
  }

  async toastTweet() {
    var notification = localStorage.getItem('location_description')

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

   async alert(message) {
      const toast = await this.toastController.create({
        message: message,
        duration: 10000,
        showCloseButton: true,
        closeButtonText: 'Cerrar',
        cssClass: 'urgent-notification'
      });
      toast.present();
    }

    openTerms(){
    let modal=this.modalCtrl.create("TermsPage");
    modal.present();
    }
   
}
