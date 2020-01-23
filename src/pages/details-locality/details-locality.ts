import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Events } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UpdateLocalityPage } from '../update-locality/update-locality';
import { ServicesPage } from '../services/services';

/**
 * Generated class for the DetailsLocalityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details-locality',
  templateUrl: 'details-locality.html',
})
export class DetailsLocalityPage {
 name:any;
  description:any;
  descriptionCount:any;
  loading:any;
  url:any;
  tokenCode:any;
  token:any;
  detailsLocality:any;
  constructor(public events: Events,public loadingController: LoadingController,public toastController: ToastController,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,private serviceUrl:ServiceUrlProvider) {
  	 this.detailsLocality = navParams.get('data');
     this.loading = this.loadingController.create({
             content: 'Por favor espere...'
         });
      this.url=serviceUrl.getUrl();
  }

  ionViewDidLoad() {
    this.name = this.detailsLocality.name;
    this.description = this.detailsLocality.description;
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

   countCharacter(event){
    this.descriptionCount=this.description.length;

   }

  updateLocality() {
        this.loading.present();
        this.tokenCode = localStorage.getItem('tokenCode');
        return  this.httpClient.put(this.url+"/api/locations/"+this.detailsLocality.id, {"_method":'PUT','name':this.name,"description":this.description,"token":this.tokenCode})
        .pipe(
        )
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.toastAlert(res.msg);
          this.events.publish('localityEvent',this.description);
          this.navCtrl.push(UpdateLocalityPage);
        },err => {
              this.loading.dismiss();
              this.toastAlert(err.error.errors);
          console.log(err.error.errors);
        }); //subscribe
    }

     deleteLocality() {
        this.loading.present();
        var headers = new HttpHeaders({
          Authorization: localStorage.getItem('token'),
        });
        this.token= localStorage.getItem('token');  

        return  this.httpClient.delete(this.url+"/api/locations/"+this.detailsLocality.id, {headers} )

        .pipe(
        )
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.toastAlert(res.msg);
          this.navCtrl.push(UpdateLocalityPage);
        },err => {
              this.loading.dismiss();
              this.toastAlert(err.error.errors);
          console.log(err.error.errors);
        }); //subscribe
    }

}
