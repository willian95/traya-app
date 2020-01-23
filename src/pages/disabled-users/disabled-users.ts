import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { DetailsUsersPage } from '../details-users/details-users';

/**
 * Generated class for the DisabledUsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-disabled-users',
  templateUrl: 'disabled-users.html',
})
export class DisabledUsersPage {
  loading:any;
  url:any;
	usersArray:any;
  user_rol:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider) {
    this.loading = this.loadingController.create({
               content: 'Por favor espere...'
           });
               this.url=serviceUrl.getUrl();
  }

  ionViewDidLoad() {
    this.getUsers();
  }

  getUsers() {
   var headers = new HttpHeaders({
       Authorization: localStorage.getItem('token'),
     })
     this.loading = this.loadingController.create({
                content: 'Por favor espere...'
            });
   this.loading.present();
    
    if(localStorage.getItem('user_rol') == "4"){

      this.httpClient.post(this.url+"/api/users/activeUsersLocation?"+'filters={"trashed":"1"}',{user_id: localStorage.getItem('user_id'), location_id: localStorage.getItem("user_locality_id")},{headers})
      .pipe()
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.usersArray=res.data;
          console.log(res);
        
      });

    }else if(localStorage.getItem('user_rol') == "3"){
      this.httpClient.get(this.url+"/api/users?"+'filters={"trashed":"1"}',{headers})
      .pipe()
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.usersArray=res.data;
          console.log(this.usersArray);
        for (var i = 0; i < this.usersArray.length; i++) {
          if(this.usersArray[i].roles[0].id == 1){
            this.user_rol='Usuario';
          }else if(this.usersArray[i].roles[0].id ==2){
            this.user_rol='Trabajador';
          }
        }
      });
    }

 }
  viewDetailsUsers(items,i){
    this.navCtrl.push(DetailsUsersPage,{data:items}); // nav
  }

}
