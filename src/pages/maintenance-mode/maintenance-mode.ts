import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController, Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { HomeAdminPage } from '../home-admin/home-admin'

/**
* Generated class for the MaintenanceModePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-maintenance-mode',
  templateUrl: 'maintenance-mode.html',
})
export class MaintenanceModePage {
  url:any;
  token:any;
  loading:any;
  tokenCode:any;
  constructor(public events: Events, private serviceUrl:ServiceUrlProvider,public toastController: ToastController,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,) {
    this.loading = this.loadingController.create({
      content: 'Por favor espere...'
    });
    this.url=serviceUrl.getUrl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MaintenanceModePage');
  }


  async presentAlert() {
    const toast = await this.toastController.create({
      message: 'Modo actualizado',
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

  changeStatus(type){
  	 this.loading = this.loadingController.create({
                 content: 'Por favor espere...'
             });
              this.loading.present();
        this.tokenCode = localStorage.getItem('tokenCode');
        return  this.httpClient.post(this.url+"/api/config", {"active":type,'token':this.tokenCode})
          .pipe()
          .subscribe((res:any)=> {
            this.loading.dismiss();
            this.presentAlert();
            this.events.publish('maintenance', res);
            this.navCtrl.setRoot("HomeAdminPage")
           },err => {
            this.loading.dismiss();
        }); //subscribe
  }

}
