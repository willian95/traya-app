import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the FavoritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorite',
  templateUrl: 'favorite.html',
})
export class FavoritePage {

  
  url:any
  user_id:any
  favorites:any
  constructor(public navCtrl: NavController, public navParams: NavParams, private serviceUrl:ServiceUrlProvider, public httpClient: HttpClient, private app : App) {
    this.url=serviceUrl.getUrl();
    this.user_id = localStorage.getItem("user_id")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritePage');
  }

  ionViewDidEnter(){
    this.fetchFavorites()
  }

  viewProfile(items,i){
    this.navCtrl.push("UserHiringPage",{data:items, comingFrom:"favorite"});
  }

  fetchFavorites(){

    this.httpClient.post(this.url+"/api/favorite/fetch", {auth_id: this.user_id})
    .pipe()
    .subscribe((res:any)=> {
      console.log(res.favorites)
      this.favorites = res.favorites
    })

  }

  backToServices(){
    this.app.getRootNav().setRoot("TrayaPage")
  }

}
