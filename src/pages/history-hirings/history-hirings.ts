import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController,Platform,Events,ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HiringDetailsPage } from '../hiring-details/hiring-details';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { NotificationPage } from '../notification/notification';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';

/**
 * Generated class for the HistoryHiringsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history-hirings',
  templateUrl: 'history-hirings.html',
})
export class HistoryHiringsPage {
  url:any;

  constructor(public toastController: ToastController,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,private alertCtrl: AlertController,private plt: Platform,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider) {
    this.url=serviceUrl.getUrl();
    this.token = window.localStorage.getItem("tokenCode")

     /*this.plt.ready().then((readySource) => {
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
  user_id:any;
  user_rol:any;
  hiringsArray:any = [];
  notificationArray:any;
  notificationNumber:any;
  averageRatingInt:any;
  loading:any
  token:any

    scheduleNotification(message,hiring_id) {
  this.localNotifications.schedule({
    id: 1,
    title: 'Atención',
    text: message,
    data: { mydata: hiring_id },
    sound: null
  });
  }

  ionViewDidLoad() {

    const channel = this.pusherNotify.init();
    let self = this;
    channel.bind('notificationUser', function(data) {
      self.scheduleNotification(data.message,data.hiring.id);
    });

    this.user_id = localStorage.getItem('user_id');
    this.user_rol = localStorage.getItem('user_rol');
    
    console.log(this.user_rol);
    if(this.token){
    
      this.getHiringsActive();
      this.getNotifications()
    }else{
      this.loading = false
    }
    
  }

   doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
      this.getHiringsActive();
    }, 2000);
  }


  getNotifications(){
    this.httpClient.get(this.url+"/api/notification/"+this.user_id+'?filters={"read":0}')
    .pipe()
    .subscribe((res:any)=> {
      this.notificationArray=res.data;
      this.notificationNumber = this.notificationArray.length;
    });
  }
  presentNotifications(){
    this.navCtrl.push("NotificationPage"); // nav
  }

  getHiringsActive() {
    this.loading = true
  this.httpClient.get(this.url+"/api/hiring?"+"user_id="+this.user_id+'&filters={"status_id":[4,5]}')
  .pipe()
    .subscribe((res:any)=> {
    this.hiringsArray=res.data;
    console.log(res.data);
    this.loading = false
    for (var i = this.hiringsArray.length - 1; i >= 0; i--) {
      this.averageRatingInt=this.hiringsArray[i].bidder.averageRatingInt;
    }
  });
  }

  viewDetails(items:any,i:any){
    var status = items.status;
    localStorage.setItem('status_id',status);
    this.httpClient.get(this.url+"/api/hiring/"+items.id)
  .pipe()
    .subscribe((res:any)=> {
      this.navCtrl.push("HiringDetailsPage",{data:res, from: "history"});
  });
  }

  deleteAll(){

    //alert(this.user_rol)
    this.httpClient.post(this.url+"/api/hiring-history/delete-all", {"user_id": this.user_id, "user_rol": this.user_rol}).pipe().subscribe((res:any) => {
      console.log("test-res", res)
      if(res.success == true){
        this.getHiringsActive()
      }

    })

  }

  confirmAlertDeleteAll() {
    let alert = this.alertCtrl.create({
      title: ' <img src="assets/imgs/info.png" class="logo2" />',
      message: '¿Desea borrar todas las solicitudes de su Historial?',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Si',
          role: 'cancel',
          handler: () => {
            this.deleteAll();
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidEnter(){
    if(this.token){
      this.storeAction()
      this.getHiringsActive()
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
