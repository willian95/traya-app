import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController } from 'ionic-angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { NotificationPage } from '../notification/notification';
import { ManageUsersPage } from '../manage-users/manage-users';
import { HomeAdminPage } from '../home-admin/home-admin';


/**
 * Generated class for the DetailsUsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
   selector: 'page-details-users',
   templateUrl: 'details-users.html',
 })
 export class DetailsUsersPage {
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

   presentNotifications(){
     this.navCtrl.push("NotificationPage"); // nav
   }


   ionViewDidLoad() {
     this.showData();
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

   enableUser() {
     this.loading = this.loadingController.create({
       content: 'Por favor espere...'
     })
     this.loading.present();
     var headers = new HttpHeaders({
       Authorization: localStorage.getItem('token'),
     });
     return  this.httpClient.get(this.url+"/api/users/"+this.id+"/restore", {headers} )
     .pipe()
     .subscribe((res:any)=> {
       this.loading.dismiss();
       this.toastAlert('Usuario habilitado exitosamente');
       this.navCtrl.setRoot("HomeAdminPage");

     },err => {
       this.loading.dismiss();
       if (err.error.errors == undefined) {
         this.toastAlert('Ha ocurrido un error en el servidor.');
       }else{
         this.toastAlert(err.error.errors);
       }
     }); //subscribe

   }

   deleteUser() {
     this.loading = this.loadingController.create({
       content: 'Por favor espere...'
     })
     this.loading.present();
     var headers = new HttpHeaders({
       Authorization: localStorage.getItem('token'),
     });
     this.token= localStorage.getItem('token');
     return  this.httpClient.delete(this.url+"/api/users/"+this.id, {headers} )
     .pipe(
       )
     .subscribe((res:any)=> {
       this.loading.dismiss();
       this.toastAlert('Usuario borrado exitosamente');
       this.navCtrl.setRoot("HomeAdminPage");

     },err => {
       this.loading.dismiss();
       if (err.error.errors == undefined) {
         this.toastAlert('Ha ocurrido un error en el servidor.');
       }else{
         this.toastAlert(err.error.errors);
       }
     }); //subscribe

   }

 }
