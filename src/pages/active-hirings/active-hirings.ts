import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Platform,ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';
import { HiringDetailsPage } from '../hiring-details/hiring-details';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { NotificationPage } from '../notification/notification';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';
import { HistoryHiringsPage } from '../history-hirings/history-hirings';


@IonicPage()
@Component({
  selector: 'page-active-hirings',
  templateUrl: 'active-hirings.html',
})
export class ActiveHiringsPage {

  url:any;
  constructor(public toastController: ToastController,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider,private pusherNotify: PusherProvider,private plt: Platform,private localNotifications: LocalNotifications,private alertCtrl: AlertController) {
    this.url=serviceUrl.getUrl();
 this.storage = localStorage;
 console.log(localStorage.getItem('valueServicesBidder'));
      // LOCALNOTIFACTION
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
  hiringsArray:any;
  user_id:any;
  contratactionNumber:any;
  last_sesion_hour:any;
  last_sesion_date:any;
  rol_id:any;
 storage:any;
  ionViewDidLoad() {
    const channel = this.pusherNotify.init();
    let self = this;
    channel.bind('notificationUser', function(data) {
      self.scheduleNotification(data.message,data.hiring.id);
    });


    this.getHiringsActive();
    this.rol_id = localStorage.getItem('user_rol');
    this.url=this.serviceUrl.getUrl();
      if (localStorage.getItem('valueServicesBidder') !=null) {
     this.toastTweet();
     this.storage.removeItem('valueServicesBidder');
    }

  }

   scheduleNotification(message,hiring_id) {
  this.localNotifications.schedule({
    id: 1,
    title: 'Genial',
    text: message,
    data: { mydata: hiring_id },
    sound: null
  });
}
  presentNotifications(){
    this.navCtrl.push(NotificationPage); // nav
  }
  getHiringsActive() {
     this.loading = this.loadingController.create({
        content: 'Por favor espere...'
      });
      this.loading.present();
    this.user_id = localStorage.getItem('user_id');
  this.httpClient.get(this.url+"/api/hiring?"+"user_id="+this.user_id+'&filters={"status_id":[1,2,3]}')
  .pipe()
    .subscribe((res:any)=> {
     this.loading.dismiss()
      this.hiringsArray=res.data;
      console.log(this.hiringsArray);
  });
  }

   doRefresh(refresher) {

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
      this.getHiringsActive();
    }, 2000);
  }

  viewDetails(items:any,i:any){
    var contratactionNumber = items.id;
    localStorage.setItem('contratactionNumber',contratactionNumber);
    var status = items.status;
    localStorage.setItem('status_id',status);
    this.httpClient.get(this.url+"/api/hiring/"+items.id)
  .pipe()
    .subscribe((res:any)=> {
      this.navCtrl.push(HiringDetailsPage,{data:res});
  });
  }
  showProfile(){
    console.log("epa");
  }


  async toastTweet() {
    var notification = localStorage.getItem('location_description')

    if(notification != "null"){
      const toast = await this.toastController.create({
        message: notification,
        showCloseButton: true,
        closeButtonText: 'Cerrar',
        cssClass: 'your-toast-css-class'
      });
      toast.present();
    }
  }


showHistory(){
    this.navCtrl.push(HistoryHiringsPage); // nav
  }
}
