import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,AlertController,ToastController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';

/**
 * Generated class for the UserOpinionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-opinions',
  templateUrl: 'user-opinions.html',
})
export class UserOpinionsPage {
    usersServices:any;
    user_id:any;
  constructor(public toastController: ToastController,private alertCtrl: AlertController,private plt: Platform,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,public navCtrl: NavController, public navParams: NavParams) {
    this.usersServices = navParams.get('data');
    console.log(this.usersServices.comments)
        // LOCALNOTIFACTION
     /*    this.plt.ready().then((readySource) => {
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

  }

}
