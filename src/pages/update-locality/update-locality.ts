import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { HttpClient } from '@angular/common/http';
import { DetailsLocalityPage } from '../details-locality/details-locality';

/**
 * Generated class for the UpdateLocalityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-locality',
  templateUrl: 'update-locality.html',
})
export class UpdateLocalityPage {
	
	url:any;
	loading:any;
	localityArray:any;	
  constructor(public navCtrl: NavController, public navParams: NavParams,private serviceUrl:ServiceUrlProvider,public httpClient: HttpClient,public loadingController: LoadingController,public toastController: ToastController) {
  this.loading = this.loadingController.create({
             content: 'Por favor espere...'
         });
           this.url=serviceUrl.getUrl();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateLocalityPage');
    this.getLocality();
  }

   getLocality() {
    this.loading.present();
  this.httpClient.get(this.url+'/api/locations')
  .pipe()
    .subscribe((res:any)=> {
    	console.log(res.data);
	    this.localityArray=res.data;
      	this.loading.dismiss();
  });
  }


  viewDetailsLocality(items,i){
    this.navCtrl.push(DetailsLocalityPage,{data:items}); // nav
  }

}
