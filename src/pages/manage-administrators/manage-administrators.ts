import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { AddAdministratorPage } from '../add-administrator/add-administrator';


/**
 * Generated class for the ManageAdministratorsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manage-administrators',
  templateUrl: 'manage-administrators.html',
})
export class ManageAdministratorsPage {

  url:any;
  loading:any;
  usersArray:any;
  locations:any;
  userLocation:any
  administratorsArray:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider) {

    
    this.url=serviceUrl.getUrl();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManageAdministratorsPage');
    this.getLocations()
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

  getUsers(){

    var headers = new HttpHeaders({
      Authorization: localStorage.getItem('token'),
    })

    this.loading = this.loadingController.create({
      content: 'Por favor espere...'
    });

    this.loading.present()

    this.httpClient.post(this.url+'/api/administratorsLocation', {location_id: this.userLocation, user_id: localStorage.getItem('user_id')}, { headers })
      //this.httpClient.get(this.url+"/api/users?"+'filters={"trashed":"1"}',{headers})
      .pipe()
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.usersArray=res.data;
          this.administratorsArray = res.administrators
      })
      

  }

  viewDetailsUsers(items,i){
    this.navCtrl.push(AddAdministratorPage,{data:items}); // nav
  }

}
