import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Platform,AlertController,ToastController,Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { UsersServicesPage } from '../users-services/users-services';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { NotificationPage } from '../notification/notification';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';

import { Observable } from 'rxjs';


import { Subscription } from "rxjs/Subscription"

@IonicPage()
@Component({
  selector: 'page-services',
  templateUrl: 'services.html',
})
export class ServicesPage {
  url:any;

  constructor(public events: Events,public toastController: ToastController,private alertCtrl: AlertController,private plt: Platform,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider) {

     this.storage = localStorage;
    this.loading = this.loadingController.create({
             content: 'Por favor espere...'
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
  servicesArray:any;
  loading:any;
  usersLoading:any;
  searchText:any;
  user_id:any;
  notificationArray:any;
  storage:any;
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



  ionViewDidLoad() {
    this.storeAction()
   const channel = this.pusherNotify.init();
    let self = this;
    channel.bind('notificationUser', function(data) {
      self.scheduleNotification(data.message,data.hiring.id);
    });

    this.user_id = localStorage.getItem('user_id');
    this.getServices();
    if (localStorage.getItem('valueServices') !=null) {
     this.toastTweet();
     this.storage.removeItem('valueServices');
    }

    /***LLAMA LA FUNCION EN UN INTERVALO DE TIEMPO***/
    // Observable.interval(200000).subscribe(()=>{
    //    this.toastTweet();
    //  });



  }
 doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
      this.getServicesRefresh();
    }, 2000);
  }


  presentNotifications(){
    this.navCtrl.push(NotificationPage); // nav
  }


 getServicesRefresh() {
     var location_id = localStorage.getItem('user_locality_id');
    this.httpClient.get(this.url+"/api/services?"+'filters={"location_id":"'+location_id+'"}')
  .pipe()
    .subscribe((res:any)=> {
    this.servicesArray=res.data;

  });
  }

  getServices() {
  var location_id = localStorage.getItem('user_locality_id');
    this.loading.present();
  //this.httpClient.get(this.url+'/api/services')
    this.httpClient.get(this.url+"/api/services?"+'filters={"location_id":"'+location_id+'"}')
  .pipe()
    .subscribe((res:any)=> {
     this.loading.dismiss();
    this.servicesArray=res.data;

  });
  }


  viewUsers(items:any,i:any){
    var location_id = localStorage.getItem('user_locality_id');
    //alert('hey')

    let usersLoading = this.loadingController.create({
      content: "Por favor espere"
    });

    usersLoading.present();

    this.httpClient.get(this.url+"/api/services_user?"+"services="+items.id+"&"+"location_id="+location_id)
    .pipe()
    .subscribe((res:any)=> {
      console.log("viewUsers")
      console.log(res)
      var servicesName = items.name;
      var services_id = items.id;
      localStorage.setItem('servicesName',servicesName);
      localStorage.setItem('services_id',services_id);
      this.navCtrl.push(UsersServicesPage,{data:res.data});
      usersLoading.dismiss();
  });
  }
  search(){
    this.httpClient.get(this.url+"/api/services?"+'filters={"name":"'+this.searchText+'"}')

    .pipe()
      .subscribe((res:any)=> {
      this.servicesArray=res.data;

    });
  }

  async toastTweet() {
    const toast = await this.toastController.create({
      message: localStorage.getItem('location_description'),
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'your-toast-css-class'
    });
    toast.present();
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
