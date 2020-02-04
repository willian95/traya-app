import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController, AlertController } from 'ionic-angular';
import { DetailsLocalityPage } from '../details-locality/details-locality';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';

/**
 * Generated class for the UpdateLocalityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-locality',
  templateUrl: 'update-locality.html',
})
export class UpdateLocalityPage {
	
	url:any;
  loading:any;
  token:any;
  localityArray:any;
  detailsLocality:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private serviceUrl:ServiceUrlProvider,public httpClient: HttpClient,public loadingController: LoadingController,public toastController: ToastController, public alertCtrl: AlertController) {
    
           this.url=serviceUrl.getUrl();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateLocalityPage');
    this.getLocality();
  }

  deleteLocation(locality, name){
    //console.log(locality)
    this.detailsLocality = locality
    this.showConfirm(name)

  }

   getLocality() {

    this.loading = this.loadingController.create({
      content: 'Por favor espere...'
    });

    this.loading.present();
  this.httpClient.get(this.url+'/api/locations')
  .pipe()
    .subscribe((res:any)=> {
    	console.log(res.data);
	    this.localityArray=res.data;
      	this.loading.dismiss();
  });
  }


  viewDetailsLocality(items,i){
    this.navCtrl.push(DetailsLocalityPage,{data:items}); // nav
  }



  showConfirm(name) {
    const confirm = this.alertCtrl.create({
      title: '¿Confima que desea eliminar "'+name+'" de la app?',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'No',
          handler: () => {
            
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.deleteLocality()
          }
        }
      ]
    });
    confirm.present();
  }

  deleteLocality() {

    this.loading = this.loadingController.create({
      content: 'Por favor espere...'
    });
   
    this.loading.present()
    var headers = new HttpHeaders({
      Authorization: localStorage.getItem('token'),
    });
    this.token= localStorage.getItem('token');  
    
    return  this.httpClient.delete(this.url+"/api/locations/"+this.detailsLocality, {headers} ).pipe()
    .subscribe((res:any)=> {
      this.loading.dismiss();
      this.toastAlert(res.msg);
      //this.navCtrl.pop()
      //this.navCtrl.push(UpdateLocalityPage)
      this.getLocality()
    },err => {
      this.loading.dismiss();
      this.toastAlert(err.error.errors);
      console.log(err.error.errors);
    }); //subscribe
    //this.loading.dismiss();
  }

  async toastAlert(data) {
    const toast = await this.toastController.create({
      message: data,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

}
