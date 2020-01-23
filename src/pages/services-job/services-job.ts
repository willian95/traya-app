import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Platform,ToastController,MenuController,ModalController, ViewController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { NotificationPage } from '../notification/notification';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
   import { TrayaPage } from '../traya/traya';
    import { TrayaBidderPage } from '../traya-bidder/traya-bidder';
    import { MaintenancePage } from '../maintenance/maintenance';
    

// import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-services-job',
  templateUrl: 'services-job.html',
})
export class ServicesJobPage {

  url:any;

  constructor(public modalCtrl: ModalController,private menu: MenuController,public toastController: ToastController,private plt: Platform,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private alertCtrl: AlertController,private serviceUrl:ServiceUrlProvider, public viewCtrl: ViewController) {
    this.loading = this.loadingController.create({
             content: 'Cargando por favor espere...'
          });
    this.url=serviceUrl.getUrl();

      this.plt.ready().then((readySource) => {
    this.localNotifications.on('click', (notification, state) => {
      let json = JSON.parse(notification.data);

      let alert = alertCtrl.create({
        title: notification.title,
        subTitle: json.mydata
      });
      alert.present();
    })
  });

  }
  token:any;
  name:any;
  email:any;
  phone:any;
  userimage:any;
  description:any;
  servicesArray:any;
  services_id:any;
  user_id:any;
  rol_id:any;
  loading:any;
  message:any;
  config:any;
  servicesNameArray: any;
  notificationArray:any;
  notificationNumber:any;
  private timeoutId: number;
      descriptionCount:any;

   scheduleNotification(message,hiring_id) {
  this.localNotifications.schedule({
    id: 1,
    title: 'Atención',
    text: message,
    data: { mydata: 'My hidden message this is' },
    sound: null
  });
}

  ionViewDidLoad() {
    this.storeAction()
 const channel = this.pusherNotify.init();
    let self = this;
    channel.bind('notificationUser', function(data) {
      self.scheduleNotification(data.message,data.hiring.id);
    });


    this.user_id = localStorage.getItem('user_id');
    //this.showUser();
    this.getServices();
    this.getNotifications();
    this.getUser();
    this.getMode();
    // this.initRefresh();

  }
 goBack(){
   this.rol_id=localStorage.getItem('user_rol');
     if (this.rol_id == 2) {
       this.navCtrl.push(TrayaBidderPage); // nav
     }else if(this.rol_id ==1){
       this.navCtrl.push(TrayaPage); // nav
     }

  }

  getMode(){
    if(localStorage.getItem('token') != null){
      var headers = new HttpHeaders({
        Authorization: localStorage.getItem('token'),
      });
      this.httpClient.get(this.url+'/api/config', { headers })
      .subscribe((response:any)=> {
        this.config=response.data;
        if(this.config.active != 0){
          const maintenanceModal = this.modalCtrl.create(MaintenancePage);
          maintenanceModal.present();
          this.menu.swipeEnable(false);
        }
      },
      err => {
        console.log('ERROR!: ', err);
      }
    );
  }else{
    console.log("sesion expirada");
  }
 }


  // ionViewDidLeave() {
  // }
//   private refresh() {
//   this.getNotifications();
// }
//   private initRefresh() {
//   this.refresh();
//   this.timeoutId = setInterval(() => this.refresh(), 15 * 1000);
// }
//
// private stopRefresh() {
//   clearInterval(this.timeoutId);
// }
// manualRefresh() {
//   this.stopRefresh();
//   this.initRefresh();
// }

  getNotifications(){
    this.httpClient.get(this.url+"/api/notification/"+this.user_id+'?filters={"read":0}')
    .pipe()
    .subscribe((res:any)=> {
      this.notificationArray=res.data;
      this.notificationNumber = this.notificationArray.length;

    });
  }



async presentAlert() {
    const toast = await this.toastController.create({
      message: '¡Genial! Se han guardado los cambios de tus servicios',
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

  async errorAlert(error) {
    const toast = await this.toastController.create({
      message: error,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }




  getServices() {
  this.httpClient.get(this.url+'/api/services')
  .pipe()
    .subscribe((res:any)=> {
      this.servicesArray=res.data;
  },err => {
        this.loading.dismiss();
        if (err.error.errors == undefined) {
          this.errorAlert('Ha ocurrido un error en el servidor.');
        }else{
          this.errorAlert(err.error.errors);
        }

    }); //subscribe;
  }


  associateUsers(){

    if(this.services_id=="" || this.services_id==null){
      this.message="Por favor seleccione el servicio";
      this.errorAlert(this.message);
    }else{
      this.loading = this.loadingController.create({
        content: 'Por favor espere...'
      });
      this.loading.present();
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      this.token = localStorage.getItem('tokenCode');
      this.user_id = localStorage.getItem('user_id');
      return  this.httpClient.post(this.url+"/api/services_user", {"description":this.description,"services":this.services_id,"user_id":this.user_id,"token":this.token})
      .pipe(
      )
      .subscribe((res:any)=> {
         this.loading.dismiss();
        this.presentAlert();
      },err => {
        this.loading.dismiss();
        if (err.error.errors == undefined) {
          this.errorAlert('Ha ocurrido un error en el servidor.');
        }else{
          this.errorAlert(err.error.errors);
        }

    }); //subscribe
    }
  }
  presentNotifications(){
    this.navCtrl.push(NotificationPage); // nav
  }
    countCharacter(event){
      this.descriptionCount=this.description.length;
      if (this.descriptionCount ==300) {
         this.errorAlert('Excediste el límite de caracteres permitidos');
      }


     }

       getUser(){
        if(localStorage.getItem('token') != null){
          var headers = new HttpHeaders({
            Authorization: localStorage.getItem('token'),
          });
           this.loading = this.loadingController.create({
        content: 'Por favor espere...'
      });
      this.loading.present();
          this.httpClient.get(this.url+'/api/auth/user', { headers })
          .subscribe((response:any)=> {
            this.loading.dismiss();
             this.showUser2(response);
            this.services_id=[];
             for(var i=0;i<response.services.length;i++){
                this.services_id.push(response.services[i].service_id)
            }
          },
          err => {
             this.loading.dismiss();
              console.log('ERROR!: ', err);
          }
        );
      }else{
        console.log("sesion expirada");
      }
    }

    showUser2(response){
      this.loading = this.loadingController.create({
        content: 'Por favor espere...'
      });
      this.loading.present();
         this.name=response.user.name;
            this.email=response.user.email;
            this.phone=response.profile.phone;
            this.servicesNameArray = response.servicesNameArray;
            if (response.profile.description == null) {
              //this.description="Describa sus trabajos";
            }else{
                this.description=response.profile.description;

            }
            this.userimage = response.image;
      this.loading.dismiss();

    }

    goToMainPage(){
     
      var rol_id = localStorage.getItem('user_rol')

      if(rol_id == "1")
        {
          this.navCtrl.setRoot(TrayaPage);
        
        }
      else
      {
        this.navCtrl.setRoot(TrayaBidderPage);
       
      }

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
