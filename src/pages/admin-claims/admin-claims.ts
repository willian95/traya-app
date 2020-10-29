import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController  } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';

/**
 * Generated class for the AdminClaimsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-claims',
  templateUrl: 'admin-claims.html',
})
export class AdminClaimsPage {

  url:any
  emails:any
  claimLocalityId:any
  locations:any = []
  loading:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, private serviceUrl:ServiceUrlProvider, public alertController: AlertController, public loadingController: LoadingController, public toastController: ToastController) {
    this.url = this.serviceUrl.getUrl()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminClaimsPage');
  }

  ionViewDidEnter(){
    this.fetchLocaltions()
  }

  fetchLocaltions(){

    this.httpClient.get(this.url+"/api/claim-locality")
    .subscribe((response:any) => {
      this.locations = response.locations
      console.log("locations", this.locations)
    })

  }

  deactivate(id){
    this.loading = this.loadingController.create({
      content: 'Por favor espere...'
    });
    this.loading.present()
    this.httpClient.post(this.url+"/api/claim-locality-deactivate", {id: id})
    .subscribe((response:any) => {
      
      this.loading.dismiss()
      this.presentAlert(response.msg)
      this.fetchLocaltions()

    })

  }
  
  showPrompt(emails, id){

    const prompt = this.alertController.create({
      title: 'Emails',
      message: "Ingresa los emails separados por comas (,)",
      inputs: [
        {
          value:emails,
          placeholder: 'Emails'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Guardar',
          handler: data => {
            this.update(data, id)
          }
        }
      ]
    });
    prompt.present();

  }

  async presentAlert(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

  update(data, id){
    this.loading = this.loadingController.create({
      content: 'Por favor espere...'
    });
    this.loading.present()
    console.log("data", data[0])
    this.httpClient.post(this.url+"/api/claim-locality-update", {id: id, emails: data[0]})
    .subscribe((response:any) => {
      
      this.loading.dismiss()
      this.presentAlert(response.msg)
      this.fetchLocaltions()

    })

  }

}
