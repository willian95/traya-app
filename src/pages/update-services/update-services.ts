import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Platform,AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';


@IonicPage()
@Component({
  selector: 'page-update-services',
  templateUrl: 'update-services.html',
})
export class UpdateServicesPage {
  url:any;
  user_id:any;
   constructor(private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,private plt: Platform,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private alertCtrl: AlertController,private serviceUrl:ServiceUrlProvider) {
    this.loading = this.loadingController.create({
             content: 'Por favor espere...'
         });
         this.url=serviceUrl.getUrl();

             // LOCALNOTIFACTION
       /*  this.plt.ready().then((readySource) => {
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
   token:any;
  servicesArray:any;
  loading:any;
  rolId:any
  userLocationId:any

  ionViewDidEnter(){
    this.rolId = window.localStorage.getItem("user_rol")
    this.userLocationId = window.localStorage.getItem("user_locality_id")
  }

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
    this.user_id = localStorage.getItem('user_id');

   const channel = this.pusherNotify.init();
    let self = this;
    channel.bind('notificationUser', function(data) {
      self.scheduleNotification(data.message,data.hiring.id);
    });
    this.getServices();

  }



  getServices() {
    this.loading.present();
  this.httpClient.get(this.url+'/api/services')
  .pipe()
    .subscribe((res:any)=> {
      this.loading.dismiss();
    this.servicesArray=res.data;

  });
  }

  viewDetailsServices(items,i){
    this.navCtrl.push("DetailsServicesPage",{data:items}); // nav
  }

}
