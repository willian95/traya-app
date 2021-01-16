import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, ToastController } from 'ionic-angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';

/**
 * Generated class for the QuickRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quick-request',
  templateUrl: 'quick-request.html',
})
export class QuickRequestPage {

  bidder_id:any
  services_id:any
  tokenCode:any
  loading:any
  comments:any
  url:any
  comingFrom:any
  userServices:any
  authEmail:any

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingController: LoadingController, public events: Events, public httpClient: HttpClient, public toastController: ToastController, private serviceUrl:ServiceUrlProvider) {
    
    this.bidder_id = this.navParams.get("bidder_id")
    this.services_id =  this.navParams.get("service_id")
    this.tokenCode = this.navParams.get("token")
    this.url=serviceUrl.getUrl();
    this.comingFrom = this.navParams.get("comingFrom")
    this.userServices = this.navParams.get("userServices")
    this.authEmail = this.navParams.get("authEmail")
    console.log("nav", this.userServices.services)
    console.log("comingFrom", this.authEmail, this.userServices.email)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuickRequestPage');
  }

  closeModal(){
    this.navCtrl.pop();
  }

  createHiring() {
   
    this.tokenCode = localStorage.getItem('tokenCode');
    
    if(this.services_id != null){

      this.loading = this.loadingController.create({content: 'Por favor espere...'});
      this.loading.present();
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );

      return  this.httpClient.post(this.url+"/api/hiring", {"bidder_id":this.bidder_id,"service_id":this.services_id,"description":this.comments, "token":this.tokenCode})
      .pipe()
      .subscribe((res:any)=> {
        this.loading.dismiss();
        this.presentAlert();
        this.events.publish('getHiringsEvent',res);
        this.events.publish("countHirings", "count")
        this.comments='';
        window.localStorage.setItem("quickrequestsent", "1")
        this.closeModal()
      },err => {
        this.loading.dismiss();
        console.log(err.error.errors);
      } ); //subscribe

    }else{
      this.presentWarning()
    }
  }

  async presentAlert() {
    const toast = await this.toastController.create({
      message: 'Felicitaciones! Tu solicitud ha sido enviada al trabajador',
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

  async presentWarning() {
    const toast = await this.toastController.create({
      message: 'Para que la solicitud sea enviada debes seleccionar un rubro de servicio',
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }


}
