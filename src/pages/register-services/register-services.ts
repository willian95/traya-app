import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Platform,ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AlertController } from 'ionic-angular';
import { TrayaPage } from '../traya/traya';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';
import { HomeAdminPage } from '../home-admin/home-admin';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-register-services',
  templateUrl: 'register-services.html',
})
export class RegisterServicesPage {
  url:any;
  constructor(public toastController: ToastController,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,private plt: Platform,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,private alertCtrl: AlertController,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider,private camera: Camera) {

    
    this.rolId = window.localStorage.getItem('user_rol');

      this.loading = this.loadingController.create({
               content: 'Por favor espere...'
           });
           this.url=serviceUrl.getUrl();

       /*      this.plt.ready().then((readySource) => {
    this.localNotifications.on('click', (notification, state) => {
      let json = JSON.parse(notification.data);

      let alert = alertCtrl.create({
        title: notification.title,
        subTitle: json.mydata
      });
      alert.present();
    })
  });*/
  }
  name:any;
  description:any;
  token:any;
  tokenCode:any;
  image:any;
   message:any;
  loading:any;
  rolId:any
  locality:any
  locations:any

    scheduleNotification(message,hiring_id) {
  this.localNotifications.schedule({
    id: 1,
    title: 'Atención',
    text: message,
    data: { mydata: hiring_id },
    sound: null
  });
}

ionViewDidEnter(){
  if(this.rolId == 3){
    this.locality = this.navParams.get('locationId');
    console.log("locality", this.locality)
  }
}

ionViewDidLoad() {
   const channel = this.pusherNotify.init();
    let self = this;
    channel.bind('notificationUser', function(data) {
      self.scheduleNotification(data.message,data.hiring.id);
    });

    

}

 convertBase64(event) {
        var input = event.target;
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = (e:any) => {
                    this.image = e.target.result;
                    console.log(this.image);
          }
          reader.readAsDataURL(input.files[0]);
        }
      }


      async presentAlert() {
    const toast = await this.toastController.create({
      message: 'Servicio Registrado con éxito.',
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

      async errorAlert(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }


  


  addServices() {
    if(this.name=="" || this.name==null){
      this.message="Por favor ingrese el nombre del servicio.";
      this.errorAlert(this.message);
    }else if(this.description=="" || this.description==null){
      this.message="Por favor ingrese la descripción del servicio.";
      this.errorAlert(this.message);
    }else if(this.image=="" || this.image==null){
      this.message="Por favor seleccione la imagen del servicio.";
      this.errorAlert(this.message);
    }else{
        this.loading = this.loadingController.create({
               content: 'Por favor espere...'
           });
        this.loading.present();
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        this.tokenCode = localStorage.getItem('tokenCode');

        let locationId = window.localStorage.getItem('user_locality_id');

        if(this.rolId == 3){
          locationId = this.locality
        }

        return  this.httpClient.post(this.url+"/api/services", {"name":this.name, "description":this.description,"logo":this.image,"token":this.tokenCode, "rolId": this.rolId, "locationId": locationId})
          .pipe()
          .subscribe((res:any)=> {
            this.loading.dismiss();
            this.presentAlert();

            this.navCtrl.setRoot("HomeAdminPage")

           },err => {
            this.loading.dismiss();
             var errors=JSON.parse(err.error.errors);
            if("name" in errors){
                this.errorAlert(errors.name  );
                 }

           
        }); //subscribe
    }

    

  }

  openGallery(){

    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.image  = 'data:image/jpeg;base64,' + imageData;

      //this.updateProfileImage()
    }, (err) => {
      // Handle error
    })
  }

  fetchLocaltions(){

    this.httpClient.get(this.url+"/api/locations")
    .subscribe((response:any) => {
      this.locations = response.data
    })

  }





}
