import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController, Events } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UpdateLocalityPage } from '../update-locality/update-locality';
import { HomeAdminPage } from '../home-admin/home-admin'
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
  userRol:any
  userLocationId:any

  constructor(public events: Events,public loadingController: LoadingController,public toastController: ToastController,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,private serviceUrl:ServiceUrlProvider) {
     this.detailsLocality = navParams.get('data');
     this.loading = this.loadingController.create({
             content: 'Por favor espere...'
         });
      this.url=serviceUrl.getUrl();
  }

  ionViewDidLoad() {

    this.userRol = localStorage.getItem('user_rol')
    this.userLocationId = localStorage.getItem('user_locality_id')

    if(this.userRol == '4'){

      var headers = new HttpHeaders({
        Authorization: localStorage.getItem('token'),
      });

      return  this.httpClient.get(this.url+"/api/location/"+this.userLocationId, {headers})
      .pipe(
      )
      .subscribe((res:any)=> {
        
        this.name = res.data.name
        this.description = res.data.description
        if(this.description != null){
          this.descriptionCount = this.description.length
        }else{
          this.descriptionCount = 0
        }

      },err => {
            //this.loading.dismiss();
            //this.toastAlert(err.error.errors);
        //console.log(err.error);
      }); //subscribe      

    }else{

      this.name = this.detailsLocality.name;
      this.description = this.detailsLocality.description;
      if(this.detailsLocality.description != null){
        this.descriptionCount = this.detailsLocality.description.length
      }else{
        this.descriptionCount = 0
      }

    }
    
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
      this.loading = this.loadingController.create({
        content: 'Por favor espere...'
    });
        this.loading.present();
        this.tokenCode = localStorage.getItem('tokenCode');

        let locationId

        if(this.userRol == 3){
          locationId = this.detailsLocality.id
        }else if(this.userRol == 4){
          locationId = this.userLocationId
        }

        return  this.httpClient.put(this.url+"/api/locations/"+locationId, {"_method":'PUT','name':this.name,"description":this.description,"token":this.tokenCode})
        .pipe(
        )
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.toastAlert(res.msg);
          this.events.publish('localityEvent',this.description);
          //if(this.userRol == 3)
            //this.navCtrl.push(UpdateLocalityPage);
          this.navCtrl.setRoot("HomeAdminPage");
        },err => {
              this.loading.dismiss();
              this.toastAlert(err.error.errors);
          console.log(err.error.errors);
        }); //subscribe
    }

     deleteNotification() {
      this.loading = this.loadingController.create({
        content: 'Por favor espere...'
    });
      this.loading.present();
      this.tokenCode = localStorage.getItem('tokenCode');
      this.description = ""

      let locationId

      if(this.userRol == 3){
        locationId = this.detailsLocality.id
      }else if(this.userRol == 4){
        locationId = this.userLocationId
      }

      return  this.httpClient.put(this.url+"/api/locations/"+locationId, {"_method":'PUT','name':this.name,"description":this.description,"token":this.tokenCode})
      .pipe(
      )
      .subscribe((res:any)=> {
        console.log(res)
        this.loading.dismiss();
        this.toastAlert(res.msg);
        this.events.publish('localityEvent',this.description);
        this.navCtrl.setRoot("HomeAdminPage");
        //if(this.userRol == 3)
        //this.navCtrl.push(UpdateLocalityPage);
      },err => {
            this.loading.dismiss();
            this.toastAlert(err.error.errors);
        console.log(err.error.errors);
      }); //subscribe
    }

}
