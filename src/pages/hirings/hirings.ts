import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Events,Platform,AlertController,ToastController, ModalController, MenuController } from 'ionic-angular';
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
  //@Output() countActiveHirings = new EventEmitter();
  url:any;
  constructor(public loadingController: LoadingController,public toastController: ToastController,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,private alertCtrl: AlertController,private plt: Platform,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public events: Events, private serviceUrl:ServiceUrlProvider, public modalCtrl: ModalController, public menu: MenuController) {
    
    console.log("nav", this.navCtrl)

    this.url=serviceUrl.getUrl();
    // LOCALNOTIFACTION
    if(localStorage.getItem("notificationId") == null){
      this.getHirings()
    }
    this.checkNotificationId()
   this.plt.ready().then((readySource) => {
    this.localNotifications.on("click", (notification, state) =>{
     
      this.checkNotificationId()
    })
  });
   /* this.plt.ready().then((readySource) => {
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
date: any;
contratactionNumber:any;
status_id:any;
rol_id:any;
filters:any;
averageRatingInt:any;
notificationArray:any;
notificationNumber:any;
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

checkNotificationId(){

  if(localStorage.getItem("notificationId") != null){
    this.loading = this.loadingController.create({
      content: 'Por favor espere...'
  });
  console.log("hirings-notification")
  //this.loading.present()
    this.httpClient.get(this.url+"/api/hiring/"+localStorage.getItem("notificationId"))
    .pipe()
      .subscribe((res:any)=> {
        //this.loading.dismiss()
        if(res.bidder.id == this.user_id){

          //alert("Debes dirigirte al modo trabajador")

        }else{
          localStorage.removeItem("notificationId")
          this.navCtrl.push("HiringDetailsPage",{data:res});
          
        }
    });

    //this.loading.dismiss()

    
  }

}

changeUserType(){

  var data={
    rol_id:'',
    user_id:'',
    token:'',
  };

  var headers = new Headers();
  headers.append("Accept", 'application/json');
  headers.append('Content-Type', 'application/json');
  this.token = localStorage.getItem('tokenCode');
  this.user_id = localStorage.getItem('user_id');
  
  var rol_id = localStorage.getItem('user_rol');
  
  //if(rol_id == "1"){
    data.rol_id = "2"
  //}else{
    //data.rol_id = "1"
  //}

  data.token=this.token;
        //return  this.httpClient.post(this.url+"/api/auth/user/update", {"password":this.password,"image":this.userimage,"location_id":this.location_id,"domicile":this.domicile,"name":this.name,"email":this.email,"phone":this.phone,"rol_id":this.rol_id,"description":this.description,"user_id":this.user_id,"token":this.token,'services':this.services_id})
  return  this.httpClient.post(this.url+"/api/auth/user/update", data)
  .pipe()
  .subscribe((res:any)=> {
    console.log(res);
      
    localStorage.setItem('user_rol', data.rol_id);
      this.events.publish('userImage',res);
      this.events.publish('userRol',data.rol_id);
    
    
    // if(this.rol_id != this.old_rol_id){
    //  this.navCtrl.setRoot(LoginPage);
    //}
      if (rol_id == "1") {
        this.navCtrl.setRoot("TrayaBidderPage"); // nav*/
      }

    })
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

ionViewDidEnter(){
  this.storeAction()
  this.checkContactReview()
}

presentNotifications(){
  this.navCtrl.push("NotificationPage"); // nav
}


getHirings() {
  //alert("hey")
  //console.log(this.countActiveHirings)
  //this.countActiveHirings.emit();
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
    this.navCtrl.push("HiringDetailsPage",{data:res});
  });
}

showHistory(){
  this.navCtrl.push("HistoryHiringsPage"); // nav

}

storeAction(){
  var user_id = localStorage.getItem('user_id')
  console.log(user_id)
  
  this.httpClient.post(this.url+"/api/userLastAction", {user_id: user_id} )
  .pipe()
  .subscribe((res:any)=> {
    console.log(res)
    

  },err => {
    
  });

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
    title:"",
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
          this.events.publish("countHirings", "count")
          this.httpClient.post(this.url+"/api/contact-review/second-question-answer", {answer: true, contact_review_id: id})
          .subscribe((res:any) => {

            this.httpClient.get(this.url+"/api/hiring/"+res.hiring.id)
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
    title:"",
    subTitle: 'Gracias por su tiempo!',
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

      
      this.firstQuestion(res.userReceiver.name, res.service.name, res.contactReview.id)

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

}
