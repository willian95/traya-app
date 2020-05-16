import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,ToastController } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

/**
 * Generated class for the TermsAndConditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {

  url:any

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public toastController: ToastController, public httpClient: HttpClient, private serviceUrl:ServiceUrlProvider) {
    this.url=serviceUrl.getUrl();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
  }

 closeModal() {
    this.viewCtrl.dismiss();
  
  }

  goBack(){
    this.navCtrl.pop();
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
