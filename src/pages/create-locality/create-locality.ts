import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ToastController } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the CreateLocalityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-locality',
  templateUrl: 'create-locality.html',
})
export class CreateLocalityPage {
	loading:any;
	locality:any;
	description:any;
  token:any;
	tokenCode:any;
  url:any;
  message:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider,public toastController: ToastController) {
  	this.loading = this.loadingController.create({
             content: 'Por favor espere...'
         });
         this.url=serviceUrl.getUrl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateLocalityPage');
  }
	async toastAlert(data) {
    	const toast = await this.toastController.create({
      	message: data,
      	duration: 3000
    	});
    	toast.present();
 	 }
 	 cleanInput(){
 	 	this.locality='';
 	 	this.description='';
 	 }

   addLocality() {
    if(this.locality=="" || this.locality==null){
      this.message="Por favor ingrese el nombre de la localidad.";
      this.toastAlert(this.message);
    }else if(this.description=="" || this.description==null){
      this.message="Por favor ingrese la descripción de la localidad.";
      this.toastAlert(this.message);
    }else{
        this.loading.present();
        this.tokenCode = localStorage.getItem('tokenCode');
        return  this.httpClient.post(this.url+"/api/locations", {"name":this.locality, "description":this.description,"token":this.tokenCode})
          .pipe(
          )
          .subscribe((res:any)=> {
            this.loading.dismiss();
            this.toastAlert(res.msg);
            this.cleanInput();
           },err => {
            this.loading.dismiss();
            this.toastAlert(err.error.errors);
            
        }); //subscribe
    }

  }

}
