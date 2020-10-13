import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ToastController,ModalController, Platform } from 'ionic-angular';
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
  unregister:any
  canLeave:boolean = false

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public toastController: ToastController,  public modalCtrl: ModalController, public platform: Platform) {

  }
  message:any;
  terms:any;

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsAndConditionsPage');
  }

  ionViewCanLeave() {
    return this.canLeave;
  }

  ionViewDidEnter(){
    this.canLeave = false
  }


  acceptTerms() {
    if (this.terms == true) {
      var terms='true';
      localStorage.setItem('terms',terms);
       this.viewCtrl.dismiss();
       this.canLeave = true
    }else{
      this.message="Debe aceptar los Términos y Condiciones para continuar."
      this.alert(this.message);
    }
  }

  goBack(){
    this.navCtrl.pop();
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
      this.canLeave = true
    let modal=this.modalCtrl.create("TermsPage");
    modal.present();
    }
   
}
