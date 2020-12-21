import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Platform,ToastController, ModalController, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HiringDetailsPage } from '../hiring-details/hiring-details';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { NotificationPage } from '../notification/notification';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';
import { HistoryHiringsPage } from '../history-hirings/history-hirings';

var interval = null

@IonicPage()
@Component({
  selector: 'page-active-hirings',
  templateUrl: 'active-hirings.html',
})
export class ActiveHiringsPage {

  url:any;
  token:any
  constructor(public toastController: ToastController,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider,private pusherNotify: PusherProvider,private plt: Platform,private localNotifications: LocalNotifications,private alertCtrl: AlertController, public modalCtrl: ModalController, public menu: MenuController) {
    this.url=serviceUrl.getUrl();
    this.token = window.localStorage.getItem("tokenCode")
 this.storage = localStorage;
 console.log(localStorage.getItem('valueServicesBidder'));

    this.checkNotificationId()

    this.plt.ready().then((readySource) => {
      this.localNotifications.on("click", (notification, state) =>{
        
        this.checkNotificationId()
      })
    });

      // LOCALNOTIFACTION
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

  loading:any;
  hiringsArray:any;
  user_id:any;
  contratactionNumber:any;
  last_sesion_hour:any;
  last_sesion_date:any;
  rol_id:any;
 storage:any;
  ionViewDidLoad() {

    interval = window.setInterval(() => {this.checkNotificationId()}, 1000)

    const channel = this.pusherNotify.init();
    let self = this;
    /*channel.bind('notificationUser', function(data) {
      self.scheduleNotification(data.message,data.hiring.id);
    });*/
    
    this.rol_id = localStorage.getItem('user_rol');
    this.url=this.serviceUrl.getUrl();
      /*if (localStorage.getItem('valueServicesBidder') !=null) {
     
        if(localStorage.getItem('terms') == 'true'){
          this.toastTweet();
        }
     this.storage.removeItem('valueServicesBidder');
    }*/

  }

  firstQuestion(receiverName, serviceName, id){
    const confirm = this.alertCtrl.create({
      message: 'Hola, te contactaste con '+receiverName+' ¿pudiste solucionar tu necesidad?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.httpClient.post(this.url+"/api/contact-review/first-question-answer", {answer: false, contact_review_id: id})
            .subscribe((res:any) => {
              this.thankYou()
              

            })
            
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.httpClient.post(this.url+"/api/contact-review/first-question-answer", {answer: true, contact_review_id: id})
            .subscribe((res:any) => {

              this.secondQuestion(receiverName, serviceName, id)

            })
            
          }
        }
      ]
    });
    confirm.present();
  }

  thankYou(){
    const alert = this.alertCtrl.create({
      subTitle: 'Gracias!',
      buttons: ['OK']
    });
    alert.present();
  }

  secondQuestion(receiverName, serviceName, id){
    const confirm = this.alertCtrl.create({
      message: '¿Deseas valorar el trabajo de '+receiverName+'  en '+serviceName+'?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.httpClient.post(this.url+"/api/contact-review/second-question-answer", {answer: false, contact_review_id: id})
            .subscribe((res:any) => {

              this.thankYouForYourTime()

            })
           
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.httpClient.post(this.url+"/api/contact-review/second-question-answer", {answer: true, contact_review_id: id})
            .subscribe((res:any) => {

              this.httpClient.get(this.url+"/api/hiring/"+id)
              .pipe()
                .subscribe((res:any)=> {
                  this.navCtrl.push("HiringDetailsPage",{data:res});
              });

            })
          }
        }
      ]
    });
    confirm.present();
  }

  thankYouForYourTime(){
    const alert = this.alertCtrl.create({
      message: 'Gracias por su tiempo!',
      buttons: ['OK']
    });
    alert.present();
  }

  checkContactReview(){
    
    this.httpClient.post(this.url+'/api/contact-review/check', {user_id: localStorage.getItem("user_id")})
    .subscribe((res:any) => {

      //alert(res.askQuestion)
      //console.log("test-res", res)
      if(res.askQuestion == true){

        
        //this.firstQuestion(res.userReceiver.name, res.service.name, res.contactReview.id)

        /*const contactReviewModal = this.modalCtrl.create("ModalContactReviewPage", {userReceiver: res.userReceiver, contactReview: res.contactReview, service: res.service});
        contactReviewModal.present();
        contactReviewModal.onDidDismiss(() => {
          
          this.httpClient.get(this.url+"/api/hiring/"+localStorage.getItem("contactReviewId"))
          .pipe()
            .subscribe((res:any)=> {
              localStorage.removeItem("contactReviewId")
              this.navCtrl.push("HiringDetailsPage",{data:res});
          });

        });
        this.menu.swipeEnable(false);*/
      }

    })

  }

  checkNotificationId(){
    
    if(localStorage.getItem("notificationId") != null){

      /*this.loading = this.loadingController.create({
          content: 'Por favor espere...'
      });*/
      //this.loading.present()
      
      window.clearInterval(interval)
      this.httpClient.get(this.url+"/api/hiring/"+localStorage.getItem("notificationId"))
      .pipe()
        .subscribe((res:any)=> {

          //this.loading.dismiss()
          /*if(res.bidder.id == this.user_id){

          }else{*/
            localStorage.removeItem("active_hirings_worker")
            localStorage.removeItem("notificationId")
            this.navCtrl.push("HiringDetailsPage",{data:res});
            //interval = window.setInterval(() => {this.checkNotificationId()}, 1000)
          //}
      });

      //this.loading.dismiss()


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
    this.navCtrl.push("NotificationPage"); // nav
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
      localStorage.setItem("active_hirings_worker", JSON.stringify(this.hiringsArray))
      console.log(this.hiringsArray);
  });
  }

   doRefresh(refresher) {
    localStorage.removeItem("active_hirings_worker")
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
      this.navCtrl.push("HiringDetailsPage",{data:res});
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
    this.navCtrl.push("HistoryHiringsPage"); // nav
  }

  ionViewDidEnter(){

    if(this.token){
      this.storeAction()
      if(localStorage.getItem("active_hirings_worker") == null){
        this.getHiringsActive();
      }else{
        this.hiringsArray= JSON.parse(localStorage.getItem("active_hirings_worker"))
      }
    }
    
    //this.checkContactReview()
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
