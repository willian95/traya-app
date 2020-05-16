import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';

/**
 * Generated class for the AdsLocationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ads-locations',
  templateUrl: 'ads-locations.html',
})
export class AdsLocationsPage {

  locations:any
  url:any

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, private serviceUrl:ServiceUrlProvider) {
    this.url = this.serviceUrl.getUrl()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdsLocationsPage');
  }

  ionViewDidEnter(){
    this.fetchLocaltions()
  }

  fetchLocaltions(){

    this.httpClient.get(this.url+"/api/locations")
    .subscribe((response:any) => {
      this.locations = response.data
    })

  }

  adminAd(id){

    this.navCtrl.push("AdminAdsPage", {locationId: id});

  }

}
