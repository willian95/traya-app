import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NotificationPage } from '../notification/notification';
import { UpdateServicesPage } from '../update-services/update-services';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';

/**
 * Generated class for the DetailsServicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details-services',
  templateUrl: 'details-services.html',
})
export class DetailsServicesPage {
  url:any;
  constructor(public loadingController: LoadingController,public toastController: ToastController,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,private serviceUrl:ServiceUrlProvider) {
      this.detailsServices = navParams.get('data');
      this.url=serviceUrl.getUrl();
      this.loading = this.loadingController.create({
                   content: 'Por favor espere...'
               });
  }
  detailsServices:any
  name:any;
  description:any;
  loading:any;
  image:any;
  image64:any;
  message:any;
  services_id:any;
  notificationArray:any;
  notificationNumber:any;
  user_id:any;
  tokenCode:any;
  token:any;
  ionViewDidLoad() {
    this.user_id = localStorage.getItem('user_id');
    this.name = this.detailsServices.name;
    this.description = this.detailsServices.description;
    this.image = this.detailsServices.logo;
    this.services_id = this.detailsServices.id;
    this.getNotifications();
  }
  presentNotifications(){
    this.navCtrl.push(NotificationPage); // nav
  }

  getNotifications(){
    this.httpClient.get(this.url+"/api/notification/"+this.user_id+'?filters={"read":0}')
    .pipe()
    .subscribe((res:any)=> {
      this.notificationArray=res.data;
      this.notificationNumber = this.notificationArray.length;
    });
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

   convertBase64(event) {
            var input = event.target;
            if (input.files && input.files[0]) {
              var reader = new FileReader();
              reader.onload = (e:any) => {
                        this.image = e.target.result;
                        this.image64 = e.target.result;
              }
              reader.readAsDataURL(input.files[0]);
            }
          }




  updateServices() {

        this.loading.present();
        this.tokenCode = localStorage.getItem('tokenCode');
        return  this.httpClient.put(this.url+"/api/services", {'_METHOD':'PUT','logo':this.image64,'name':this.name,'service_id':this.services_id,"description":this.description,"token":this.tokenCode})
        .pipe(
        )
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.toastAlert(res.msg);
          this.navCtrl.push(UpdateServicesPage);
        },err => {
              this.loading.dismiss();
          console.log(err.error.errors);
        }); //subscribe
    }

     deleteServices() {
     this.loading = this.loadingController.create({
                   content: 'Por favor espere...'
               })
        this.loading.present();
        var headers = new HttpHeaders({
          Authorization: localStorage.getItem('token'),
        });
        this.token= localStorage.getItem('token');  
        return  this.httpClient.delete(this.url+"/api/services/"+this.services_id, {headers} )
        .pipe(
        )
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.toastAlert(res.msg);
          this.navCtrl.push(UpdateServicesPage);
        },err => {
              this.loading.dismiss();
        }); //subscribe
    }

}
