import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController,LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
 url:any;

  constructor(private serviceUrl:ServiceUrlProvider,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public toastController: ToastController,private alertCtrl: AlertController,private socialSharing: SocialSharing,public loadingController: LoadingController) {
     this.loading = this.loadingController.create({
             content: 'Por favor espere...'
         });
         this.url=serviceUrl.getUrl();
  }
  loading:any;
  name:any;
  comments:any;
  message:any;
  tokenCode:any;
  email:any;



  ionViewDidLoad() {
    this.tokenCode = localStorage.getItem('tokenCode');
    this.name = localStorage.getItem('user')
    this.email = localStorage.getItem('useremail')
  }


     async errorAlertToast1(error1) {
    const toast = await this.toastController.create({
      message: error1,
      duration: 2000
    });
    toast.present();
  }

    async presentAlertToast1() {
    const toast = await this.toastController.create({
      message: 'Tu comentario se envió con éxito',
      duration: 2000
    });
    toast.present();
  }
  cleanInput(){
  this.name='';
  this.email='';
  this.comments='';
  }

   sendMessage() {
      if(this.name=="" || this.name==null){
       this.message = "Por favor ingrese su nombre.";
       this.errorAlertToast1(this.message);
      }
      
      else if(this.email=="" || this.email==null){
        this.message="Por favor ingrese su correo electrónico.";
        this.errorAlertToast1(this.message);
      }

      else if(this.comments=="" || this.comments==null){
        this.message="Por favor ingrese su comentario.";
        this.errorAlertToast1(this.message);
      }
      
      else{
        this.loading.present();
        return  this.httpClient.post(this.url+"/api/contact", {"name":this.name,"email":this.email,"message":this.comments})
        .pipe(
        )
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.presentAlertToast1();
          this.cleanInput();

          this.navCtrl.setRoot("TrayaPage");

        },err => {
              this.loading.dismiss();
              this.errorAlertToast1(err.error);
          console.log(err.error.errors);
        }); //subscribe
      }
    }

}
