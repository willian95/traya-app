import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { DetailsUsersPage } from '../details-users/details-users';

/**
 * Generated class for the ManageUsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-users',
  templateUrl: 'manage-users.html',
})
export class ManageUsersPage {
	loading:any;
  url:any;
	usersArray:any;
  user_rol:any;
  locations:any;
  userLocation:any
  rol_id:any;
  usersCount:any

  constructor(public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider) {
    this.url=serviceUrl.getUrl();
  }

  ionViewDidLoad() {

    this.rol_id = localStorage.getItem("user_rol")
    if(this.rol_id == 3){
      this.getLocations()
    }else{
      this.getUsers();
    }
    //this.getUsers();
    
  }

  getLocations(){

    this.loading = this.loadingController.create({
      content: 'Por favor espere...'
  });
    
    this.loading.present();

    this.httpClient.get(this.url+'/api/locations')
    .pipe()
      .subscribe((res:any)=> {
        this.loading.dismiss();
        this.locations = res.data
    });

  }

   getUsers() {

    var headers = new HttpHeaders({
        Authorization: localStorage.getItem('token'),
      })

      this.loading = this.loadingController.create({
        content: 'Por favor espere...'
    });

    this.loading.present();

    if(localStorage.getItem("user_rol") == "4")
      var user_locality = localStorage.getItem("user_locality_id")

    if(localStorage.getItem("user_rol") == "4"){

      this.httpClient.post(this.url+'/api/users/activeUsersLocation', {location_id: user_locality, user_id: localStorage.getItem('user_id')}, { headers })
      .pipe()
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.usersArray=res.data;
          this.usersCount = this.usersArray.length

          for (var i = 0; i < this.usersArray.length; i++) {
            if(this.usersArray[i].roles[0].id == 1){
              this.user_rol='Usuario';
            }else if(this.usersArray[i].roles[0].id ==2){
              this.user_rol='Trabajador';
            }
          }
      });

    }else if(localStorage.getItem("user_rol") == "3"){

      this.httpClient.post(this.url+'/api/users/activeUsersLocation', {location_id: this.userLocation, user_id: localStorage.getItem('user_id')}, { headers })
      //this.httpClient.get(this.url+"/api/users?"+'filters={"trashed":"1"}',{headers})
      .pipe()
        .subscribe((res:any)=> {
        this.loading.dismiss();
        this.usersArray=res.data;
        this.usersCount = this.usersArray.length
          console.log(this.usersArray)
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
