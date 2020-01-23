import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the StatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})
export class StatisticsPage {

  url:any;
  workers:0;
  users:0;
  locations:any
  location:any
  newUsers:any
  contracts:any
  contacts:any
  totalContacts:any
  totalContracts:any
  user_rol:any

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, private serviceUrl:ServiceUrlProvider) {
    this.url = serviceUrl.getUrl();
    this.user_rol = localStorage.getItem('user_rol')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatisticsPage');
    this.getLocations()
    //this.getStatistics()
  }

  getLocations(){

    this.httpClient.get(this.url+"/api/locations")
    .pipe()
    .subscribe((res:any) => {
      this.locations = res.data
    })

  }

  getStatistics(){

    if(this.user_rol == "4"){
      this.location = localStorage.getItem("user_locality_id")
    }

    this.httpClient.post(this.url+"/api/users/statistics/count", {"location_id": this.location})
    .pipe()
    .subscribe((res:any)=> {
      
      this.users = res.userRoles
      this.workers = res.workerRoles

      this.newUsers =res.usersThreeMonthsAgo
      this.contracts =res.contractsThreeMonthsAgo
      this.contacts = res.contactsThreeMonthsAgo
      this.totalContacts = res.totalContacts
      this.totalContracts = res.totalContracts

    });

  }



}
