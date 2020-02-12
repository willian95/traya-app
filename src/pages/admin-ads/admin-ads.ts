import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController} from 'ionic-angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';

/**
 * Generated class for the AdminAdsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-ads',
  templateUrl: 'admin-ads.html',
})
export class AdminAdsPage {

  file:File
  adTypes:any
  adType:any
  url:any
  ads:any
  adsCount:any
  loading:any

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, private serviceUrl:ServiceUrlProvider, private toastController:ToastController, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.url=serviceUrl.getUrl();
    this.adType = ""
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminAdsPage');
    this.getAdTypes()
    this.getAds()
  }

  convertBase64(event) {

    if(this.adType == ""){      

      ((document.getElementById("file") as HTMLInputElement).value = "")
      this.toastAlert("Debe seleccionar un tipo de publicidad")

    }else{

      var input = event.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e:any) => {

          this.file = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
      }

    }

    
  }

  uploadAd(){

    let formData = new FormData();
    formData.append('file', this.file)
    formData.append('locality_id', localStorage.getItem('user_locality_id'))
    formData.append('ad_type_id', this.adType)

    this.loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });
    this.loading.present();

    this.httpClient.post(this.url+'/api/administrator/ad/store', formData)
    .subscribe((response:any)=> {

      this.toastAlert(response.msg)
      this.adType = "";
      ((document.getElementById("file") as HTMLInputElement).value = "")

      this.loading.dismiss()
      this.getAds()

    },err => {
      this.toastAlert(err.msg)
      this.loading.dismiss()
    })

  }

  getAdTypes(){

    this.loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });
    //this.loading.present();

    this.httpClient.get(this.url+'/api/administrator/ad/getType')
    .subscribe((response:any)=> {
        
      this.adTypes = response
      //this.loading.dismiss()
    });

  }
  
  async toastAlert(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

  getAds(){

    this.loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });
    this.loading.present();

    this.httpClient.get(this.url+'/api/administrator/ad/location/'+localStorage.getItem('user_locality_id'))
    .subscribe((response:any)=> {


      this.ads = response.ads
      this.adsCount =  this.ads.length
      this.loading.dismiss()
    });

  }

  showAlert(id) {
    const confirm = this.alertCtrl.create({
      title: '¿Desea eliminar este anuncio?',
      enableBackdropDismiss:false,
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.deleteAd(id)
          }
        }
      ]
    });
    confirm.present();
  }

  deleteAd(id){

    this.loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });
    this.loading.present();

    this.httpClient.delete(this.url+'/api/administrator/ad/delete/'+id)
    .subscribe((response:any)=> {
      this.toastAlert(response.msg)
      this.loading.dismiss()
      this.getAds()
    }, err =>{

      this.toastAlert(err.msg)
      this.loading.dismiss()

    });

  }

}
