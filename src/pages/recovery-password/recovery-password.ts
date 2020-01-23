import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController,ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';


/**
 * Generated class for the RecoveryPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recovery-password',
  templateUrl: 'recovery-password.html',
})
export class RecoveryPasswordPage {

	url:any;
	email:any;
	 token:any;
	 loading:any;
  tokenCode:any;
  constructor(public toastController: ToastController,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private alertCtrl: AlertController,private serviceUrl:ServiceUrlProvider) {
     this.loading = this.loadingController.create({
      content: 'Por favor espere...'
    });
    this.url=serviceUrl.getUrl();
     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecoveryPasswordPage');
  }



   async presentAlert() {
    const toast = await this.toastController.create({
      message: 'Enviado con éxito.',
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }


     async errorAlert(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

 

  sendPassword(){
    if (this.email == null || this.email =='' ) {
      this.errorAlert('Debe ingresar el correo');
    }else{
  	 this.loading = this.loadingController.create({
                 content: 'Por favor espere...'
             });
              this.loading.present();
        this.tokenCode = localStorage.getItem('tokenCode');
        return  this.httpClient.post(this.url+"/api/recoveryPassword", {"email":this.email})
          .pipe(
          )
          .subscribe((res:any)=> {
            this.loading.dismiss();
            this.presentAlert();
            this.email="";
           },err => {
            this.loading.dismiss();
             var errors=JSON.parse(err.error.errors);
            console.log(err.error.errors);
          if("email" in errors){
              this.errorAlert(errors.email);
               }
        }); //subscribe
    }
  }
}
