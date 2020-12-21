import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,AlertController,ToastController,ModalController,MenuController, LoadingController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';
import { ActiveHiringsPage } from '../active-hirings/active-hirings';
import { HistoryHiringsPage } from '../history-hirings/history-hirings';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NotificationPage } from '../notification/notification';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';
import { MaintenancePage } from '../maintenance/maintenance';
import { TrayaPage } from '../traya/traya';
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()
@Component({
  selector: 'page-traya-bidder',
  templateUrl: 'traya-bidder.html',
})
export class TrayaBidderPage {
  @ViewChild(SuperTabs) superTabs: SuperTabs;
  url:any;
notificationArray:any;
notificationNumber:any;
    page1: any = "ActiveHiringsPage";
    // page2: any = HistoryHiringsPage;
    username:any;
    user_id:any;
    config:any;
    token:any;
    hiringCount:any
    loading:any
  constructor(private statusBar: StatusBar, public loadingController: LoadingController, private menu: MenuController,public modalCtrl: ModalController,public events: Events,public toastController: ToastController,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,private alertCtrl: AlertController,private plt: Platform,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,private serviceUrl:ServiceUrlProvider) {
    this.hiringCount = 0
    this.url=serviceUrl.getUrl();
    this.token = window.localStorage.getItem("tokenCode")

    this.events.subscribe('countHirings', (data) =>{
      this.countActiveHirings()
    });

    /*this.plt.ready().then((readySource) => {
      this.localNotifications.on('click', (notification, state) => {
      
        this.loading = this.loadingController.create({
            content: 'Por favor espere...'
        });
        this.loading.present()
        console.log("traya-bidder-notification changeUser")
        this.httpClient.get(this.url+"/api/hiring/"+localStorage.getItem("notificationId"))
        .pipe()
          .subscribe((res:any)=> {
            this.loading.dismiss()
            if(res.applicant.id == this.user_id){
  
             this.changeUserType()
  
            }
        });
        this.loading.dismiss()
  
      })
    });*/

  // let status bar overlay webview
  //this.statusBar.overlaysWebView(true);

  this.statusBar.backgroundColorByHexString('#7f0093');

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

checkNotificationId(){

  if(localStorage.getItem("notificationId") != null){

    if(localStorage.getItem("notificationId") != "undefined"){

      this.httpClient.get(this.url+"/api/hiring/"+localStorage.getItem("notificationId"))
      .pipe()
        .subscribe((res:any)=> {
          localStorage.removeItem("notificationId")
          this.navCtrl.push("HiringDetailsPage",{data:res});
      });

    }else{
      localStorage.removeItem("notificationId")
    }
  }

}

checkChatId(){

  if(localStorage.getItem("chatId") != null){
    
    let chatId = localStorage.getItem("chatId")
    localStorage.removeItem("chatId")

    this.httpClient.get(this.url+"/api/user/"+chatId)
    .subscribe((res:any) => {

      console.log("chat-res",res)
      this.navCtrl.push("ChatPage", {username: res.user.name,userimage:res.image, bidder_id: res.user.id})

    })

    //this.navCtrl.push("ChatPage", {username: username,userimage:userimage, bidder_id: bidder_id})
    //this.navCtrl.push("HiringDetailsPage",{data:res});
  
  }

}


  ionViewDidLoad() {
    this.storeAction()
      const channel = this.pusherNotify.init();
    let self = this;
    channel.bind('notificationUser', function(data) {
      self.scheduleNotification(data.message,data.hiring.id);
      self.events.publish('notifiticarionHiring',data.hiring);

    });


    this.user_id = localStorage.getItem('user_id');
    this.getNotifications();
    this.getMode();

    //window.setInterval(() => {
      this.countActiveHirings()
    //}, 5000) 

  }

  ionViewDidEnter(){

    this.storeAction()
    this.checkChatId()

  }

  slideToIndex(index: number) {
   this.superTabs.slideTo(index);
 }

 hideToolbar() {
   this.superTabs.showToolbar(false);
 }
 presentNotifications(){
   this.navCtrl.push("NotificationPage"); // nav
 }
 getNotifications(){
   this.httpClient.get(this.url+"/api/notification/"+this.user_id+'?filters={"read":0}')
   .pipe()
   .subscribe((res:any)=> {
     this.notificationArray=res.data;
     this.notificationNumber = this.notificationArray.length;
   });
 }

 changeUserType(){

  if(this.token){
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
      //data.rol_id = "2"
    //}else{
      data.rol_id = "1"
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
  
        this.navCtrl.setRoot("TrayaPage"); // nav*/
        
  
      })
  }else{
    this.navCtrl.setRoot("TrayaPage");
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
         const maintenanceModal = this.modalCtrl.create("MaintenancePage");
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


showConfirm() {
  const confirm = this.alertCtrl.create({
    message: '¿Desea cambiar de modo Trabajador a modo Usuario? ',
    buttons: [
      {
        text: 'No',
        handler: () => {
          console.log('Disagree clicked');
        }
      },
      {
        text: 'Sí',
        handler: () => {
          this.changeUserType()
        }
      }
    ]
  });
  confirm.present();
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

 countActiveHirings(){

  if(localStorage.getItem('token') != null){
    var headers = new HttpHeaders({
      Authorization: localStorage.getItem('token'),
    });
    this.httpClient.post(this.url+'/api/countActive/hiring', {"user_id": localStorage.getItem('user_id')})
    .subscribe((response:any)=> {
      
      console.log("test-reponse", response)

      if(response.success == true){
        
        if(localStorage.getItem('user_rol') == "1"){
          
          this.hiringCount = response.applicantCount
        }else if(localStorage.getItem('user_rol') == "2"){
          this.hiringCount = response.bidderCount
        
        }

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

}
