import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
/**
 * Generated class for the AboutTrayaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about-traya',
  templateUrl: 'about-traya.html',
})
export class AboutTrayaPage {

  url:any

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient,private serviceUrl:ServiceUrlProvider) {
    this.url = serviceUrl.getUrl()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutTrayaPage');
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
