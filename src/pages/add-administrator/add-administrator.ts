import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { ManageAdministratorsPage } from '../manage-administrators/manage-administrators';

/**
 * Generated class for the AddAdministratorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-administrator',
  templateUrl: 'add-administrator.html',
})
export class AddAdministratorPage {

  detailsUser:any;
  loading:any;
  url:any;
  name:any;
  user_rol:any;
  image:any;
  id:any;
  email:any;
  token:any;
  deleted_at:any;

  constructor(public loadingController: LoadingController,public toastController: ToastController,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,private serviceUrl:ServiceUrlProvider) {
    this.detailsUser = navParams.get('data');
     this.url=serviceUrl.getUrl();
     this.loading = this.loadingController.create({
       content: 'Por favor espere...'
     })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAdministratorPage');
    this.showData()
  }

  showData(){
    this.id=this.detailsUser.id;
    this.image=this.detailsUser.image;
    this.name= this.detailsUser.user.name;
    this.email= this.detailsUser.user.email;
    this.deleted_at = this.detailsUser.user.deleted_at;
    if(this.detailsUser.roles[0].id == 1){
      this.user_rol='Usuario';
    }else if(this.detailsUser.roles[0].id ==2){
      this.user_rol='Trabajador';
    }else if(this.detailsUser.roles[0].id ==4){
      this.user_rol='Administrador de localidad';
    }
  }

  async toastAlert(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

  enableAdministrator(){

    this.loading = this.loadingController.create({
      content: 'Por favor espere...'
    })
    this.loading.present();
    var headers = new HttpHeaders({
      Authorization: localStorage.getItem('token'),
    });
    this.token= localStorage.getItem('token');
    return  this.httpClient.post(this.url+"/api/enableAdministrator",{user_id: this.id}, {headers})
    .pipe()
    .subscribe((res:any)=> {
      this.loading.dismiss();
      //console.log(res)
      this.toastAlert('Usuario actualizado correctamente');
      this.navCtrl.push(ManageAdministratorsPage);

    },err => {
        this.loading.dismiss();
        if (err.error.errors == undefined) {
          this.toastAlert('Ha ocurrido un error en el servidor.');
        }else{
          this.toastAlert(err.error.errors);
        }    

    })  

  }


  disableAdministrator(){

    this.loading = this.loadingController.create({
      content: 'Por favor espere...'
    })
    this.loading.present();
    var headers = new HttpHeaders({
      Authorization: localStorage.getItem('token'),
    });
    this.token= localStorage.getItem('token');
    return  this.httpClient.post(this.url+"/api/disableAdministrator",{user_id: this.id}, {headers})
    .pipe()
    .subscribe((res:any)=> {
      this.loading.dismiss();
      //console.log(res)
      this.toastAlert('Usuario actualizado correctamente');
      this.navCtrl.push(ManageAdministratorsPage);

    },err => {
        this.loading.dismiss();
        if (err.error.errors == undefined) {
          this.toastAlert('Ha ocurrido un error en el servidor.');
        }else{
          this.toastAlert(err.error.errors);
        }    

    })  

  }

}
