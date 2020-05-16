import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';

/**
 * Generated class for the AboutTrayaBidderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about-traya-bidder',
  templateUrl: 'about-traya-bidder.html',
})
export class AboutTrayaBidderPage {

  showBackButton:any
  url:any

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public httpClient: HttpClient,private serviceUrl:ServiceUrlProvider) {

    this.url = serviceUrl.getUrl()
    this.showBackButton = false
    let about_bidder = localStorage.getItem('about_band_bidder')

    if(about_bidder == "true"){
      this.showBackButton = true
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutTrayaBidderPage');
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
 dontSee() {
    localStorage.setItem('about_band_bidder','true');
    localStorage.setItem('about_band','true');
    this.viewCtrl.dismiss();
  }

  ionViewDidEnter(){
    this.storeAction()
  }

  storeAction(){
    var user_id = localStorage.getItem('user_id')
    console.log(user_id)
    
    this.httpClient.post(this.url+"/api/userLastAction", {user_id: user_id} )
    .pipe(
      )
    .subscribe((res:any)=> {
      console.log(res)
      
  
    },err => {
      
    });
  
   }
 
}
