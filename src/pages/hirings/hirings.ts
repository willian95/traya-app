import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Events,Platform,AlertController,ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HiringDetailsPage } from '../hiring-details/hiring-details';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { NotificationPage } from '../notification/notification';
import { HistoryHiringsPage } from '../history-hirings/history-hirings';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';

/**
* Generated class for the HiringsPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-hirings',
  templateUrl: 'hirings.html',
})
export class HiringsPage {
  url:any;
  constructor(public loadingController: LoadingController,public toastController: ToastController,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,private alertCtrl: AlertController,private plt: Platform,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public events: Events, private serviceUrl:ServiceUrlProvider) {
  
    this.url=serviceUrl.getUrl();
    // LOCALNOTIFACTION
   this.getHirings()
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
date: any;
contratactionNumber:any;
status_id:any;
rol_id:any;
filters:any;
averageRatingInt:any;
notificationArray:any;
notificationNumber:any;

scheduleNotification(message,hiring_id) {
  this.localNotifications.schedule({
    id: 1,
    title: 'Atención',
    text: message,
    data: { mydata: hiring_id },
    sound: null
  });
}

doRefresh(refresher) {
  setTimeout(() => {
    refresher.complete();
    this.getHirings();
  }, 2000);
}

ionViewDidLoad() {
  // if( localStorage.getItem('indexTab') == '1'){
  //
  //
  // }

  this.storeAction()
  const channel = this.pusherNotify.init();
  let self = this;
  channel.bind('notificationUser', function(data) {
    self.scheduleNotification(data.message,data.hiring.id);
  });

  this.user_id = localStorage.getItem('user_id');
  this.rol_id = localStorage.getItem('user_rol');


  this.events.subscribe('getHiringsEvent',(res)=>{
    this.getHiringsNoEvent();
  });

  this.events.subscribe('changeIndex',(res)=>{
    this.getHiringsNoEvent();
  });
}
presentNotifications(){
  this.navCtrl.push(NotificationPage); // nav
}


getHirings() {
  this.loading = this.loadingController.create({
    content: 'Por favor espere...'
  });
  this.loading.present();
  this.user_id = localStorage.getItem('user_id');
  this.httpClient.get(this.url+"/api/hiring?"+"user_id="+this.user_id+'&filters={"status_id":[1,2,3]}')
  .pipe()
  .subscribe((res:any)=> {
    
    this.loading.dismiss();
    this.hiringsArray=res.data;
    for (var i = this.hiringsArray.length - 1; i >= 0; i--) {
      this.averageRatingInt=this.hiringsArray[i].bidder.averageRatingInt;
    }
  });
}

getHiringsNoEvent() {
  this.user_id = localStorage.getItem('user_id');
  this.httpClient.get(this.url+"/api/hiring?"+"user_id="+this.user_id+'&filters={"status_id":[1,2,3]}')
  .pipe()
  .subscribe((res:any)=> {
    
    this.hiringsArray=res.data;
    for (var i = this.hiringsArray.length - 1; i >= 0; i--) {
      this.averageRatingInt=this.hiringsArray[i].bidder.averageRatingInt;
    }
  });
}


getHiringsFilters() {
  if(this.filters !=6){
    this.filters;
  }else{
    this.filters =[1,2,3];
  }

  this.user_id = localStorage.getItem('user_id');
  this.httpClient.get(this.url+"/api/hiring?"+"user_id="+this.user_id+'&filters={"status_id":['+this.filters+']}')
  .pipe()
  .subscribe((res:any)=> {
    this.hiringsArray=res.data;
  });
}

viewDetails(items:any,i:any){
  var status = items.status;
  localStorage.setItem('status_id',status);
  var contratactionNumber = items.id;
  localStorage.setItem('contratactionNumber',contratactionNumber);
  this.httpClient.get(this.url+"/api/hiring/"+items.id)
  .pipe()
  .subscribe((res:any)=> {
    this.navCtrl.push(HiringDetailsPage,{data:res});
  });
}

showHistory(){
  this.navCtrl.push(HistoryHiringsPage); // nav

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
