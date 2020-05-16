import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,ToastController,LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AlertController } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';
import { DetailHiringNotificationPage } from '../detail-hiring-notification/detail-hiring-notification';


/**
* Generated class for the NotificationPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  url:any;
  dataPrueba:any;
  constructor(public toastController: ToastController,private localNotifications: LocalNotifications,private plt: Platform,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,private alertCtrl: AlertController,private serviceUrl:ServiceUrlProvider,private pusherNotify: PusherProvider, public loadingController: LoadingController) {
  
   this.loading = this.loadingController.create({
             content: 'Por favor espere...'
         });
 
    this.url=serviceUrl.getUrl();
    this.dataPrueba = navParams.get('data');

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
   loading:any;
  user_id:any;
  rol_id: any;
  method:any;
  notificationArray:any;
  tokenCode:any;
  token:any;

  // errorAlert() {
  //   let alert = this.alertCtrl.create({
  //     title: "epa2",
  //     // subTitle: this.dataPrueba[0],
  //     subTitle: this.dataPrueba.mydata,
  //     buttons: ['Ok']
  //   });
  //   alert.present();
  // }


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



  ionViewDidLoad() {
   const channel = this.pusherNotify.init();
    let self = this;
    channel.bind('notificationUser', function(data) {
      self.scheduleNotification(data.message,data.hiring.id);
    });
    this.user_id = localStorage.getItem('user_id');
    this.rol_id = localStorage.getItem('user_rol');
    this.getNotifications();
    // this.errorAlert();
  }


  getNotifications(){
  this.loading.present();

    let worker = false
    if(this.rol_id == 2){
      worker = true
    }

    this.httpClient.get(this.url+"/api/notification/"+this.user_id+"/is_worker/"+worker+'?filters={"read":0}')
    .pipe()
    .subscribe((res:any)=> {
      console.log(res.data);
       this.loading.dismiss();
      this.notificationArray=res.data;
    });
  }

  viewDetails(items){
    console.log(items);
    this.httpClient.get(this.url+"/api/hiring/"+items.hiring_id)
  .pipe()
    .subscribe((res:any)=> {
      this.navCtrl.push("DetailHiringNotificationPage",{data:res});
  });
  }


 async readNotificationAlert() {
 const toast = await this.toastController.create({
   message: 'Notificación leída',
   duration: 2000
 });
 toast.present();
}
  changeStatus(items,i){
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    this.tokenCode = localStorage.getItem('tokenCode');
    this.method='PUT';
    return  this.httpClient.post(this.url+"/api/notification/"+items.id, {"_method":this.method,"token":this.tokenCode})
      .pipe(
      )
      .subscribe((res:any)=> {
        this.readNotificationAlert();
        this.getNotifications();
       },err => {
    }); //subscribe
  }
}
