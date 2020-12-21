/*import { Component } from '@angular/core';
import { NavController,MenuController,Events,AlertController, Platform,ToastController, ModalController, ViewController  } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TrayaPage } from '../traya/traya';
import { ServicesJobPage } from '../services-job/services-job';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { TrayaBidderPage } from '../traya-bidder/traya-bidder';
import { DetailHiringNotificationPage } from '../detail-hiring-notification/detail-hiring-notification';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HomeAdminPage } from '../home-admin/home-admin';
import { UpdateModalPage } from '../update-modal/update-modal'; //importo el modal
import { AppVersion } from '@ionic-native/app-version';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicPage } from 'ionic-angular';
import { UserHiringPage } from '../user-hiring/user-hiring';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { NgZone } from '@angular/core';*/

import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,AlertController,ToastController,ModalController,MenuController, LoadingController} from 'ionic-angular';
import { Events } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  /*url:any;
  protected app_version: any;
  downProg = 0*/
  @ViewChild(SuperTabs) superTabs: SuperTabs;

  page1: any = "ServicesPage";
  page2: any = "HiringsPage";
  username:any;
  user_id:any;
  token:any;
  url:any;
  notificationArray:any;
  notificationNumber:any;
  config:any;
  loading:any;
  hiringCount:any

  constructor(private statusBar: StatusBar, public loadingController: LoadingController, private menu: MenuController,public modalCtrl: ModalController,public events: Events,public toastController: ToastController,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,private alertCtrl: AlertController,private plt: Platform,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,private serviceUrl:ServiceUrlProvider) {
    this.hiringCount = 0;
    this.url=serviceUrl.getUrl();
      
    this.events.subscribe('countHirings', (data) =>{
      this.countActiveHirings()
    });

    this.token = window.localStorage.getItem("tokenCode")

    this.plt.ready().then((readySource) => {
      this.localNotifications.on('click', (notification, state) => {
       
        this.loading = this.loadingController.create({
            content: 'Por favor espere...'
        });
        console.log("traya-notification changeUser")
        //this.loading.present()

        if(localStorage.getItem("notificationId") != "undefined"){
          this.httpClient.get(this.url+"/api/hiring/"+localStorage.getItem("notificationId"))
          .pipe()
            .subscribe((res:any)=> {
              //this.loading.dismiss()
              if(res.bidder.id == this.user_id){
    
                alert("Debes dirigirte al modo trabajador")
    
              }
          });
        }else{
          localStorage.removeItem("notificationId")
        }

        
        
  
      })
    });

  this.statusBar.backgroundColorByHexString('#7f0093');

  }

     scheduleNotification(message,hiring_id) {
  this.localNotifications.schedule({
    id: 1,
    title: 'Atención',
    text: message,
    data: { mydata: hiring_id},
    sound: null
  });
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

  ionViewDidEnter(){
    this.validateSession()
    this.checkChatId()
    this.storeAction()
    this.checkContactReview()
  }

  ionViewDidLoad() {
    
    //window.setInterval(() => {
      this.countActiveHirings()
    //}, 5000) 
  
    const channel = this.pusherNotify.init();
    let self = this;
    channel.bind('notificationUser', function(data) {
      self.scheduleNotification(data.message,data.hiring.id);
      self.events.publish('notifiticarionHiring',data.hiring);
      var hiring_id = data.hiring.id;
      localStorage.setItem('hiring_id',hiring_id);
    });

    this.user_id = localStorage.getItem('user_id');
    this.getMode();

  }
  slideToIndex(index: number) {
   this.superTabs.slideTo(index);
 }
 presentNotifications(){
   this.navCtrl.push("NotificationPage"); // nav
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

 hideToolbar() {
   this.superTabs.showToolbar(false);
 }

 onTabSelect(ev: any){
   var indexTab =ev.index;
   localStorage.setItem('indexTab',indexTab);

    if(indexTab == 1){

    }

   if(localStorage.getItem('indexTab') =='1'){
     this.events.publish('changeIndex','res');
   }

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
    }else{
      this.navCtrl.setRoot("TrayaBidderPage");
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

checkContactReview(){

  var headers = new HttpHeaders({
    Authorization: localStorage.getItem('token'),
  });
  this.httpClient.post(this.url+'/api/contact-review/check', { headers })
  .subscribe((res:any) => {

    console.log("test-check-contact-review", res)

  })

}

validateSession(){
    
  if(localStorage.getItem('token') != null){
    let data = {
      user:{
        name:localStorage.getItem('user')
      },
      image:localStorage.getItem('userimage'),
      token:localStorage.getItem('token'),
      tokenCode:localStorage.getItem('tokenCode'),
      roles:[
        {
          id:localStorage.getItem('user_rol')
        }
      ]
    }

    //console.log("test-data", data)

    if(localStorage.getItem('user_rol') == "1"){
      this.navCtrl.setRoot("TrayaPage");
      this.events.publish('userLogged',data);
    }else if(localStorage.getItem('user_rol') == "2"){
      this.navCtrl.setRoot("TrayaBidderPage");
      this.events.publish('userLogged',data);
    }else if(localStorage.getItem('user_rol') == "3"){
      this.navCtrl.setRoot("HomeAdminPage");
      this.events.publish('userLogged',data);
    }else if(localStorage.getItem('user_rol') == "4"){
      this.navCtrl.setRoot("HomeAdminPage");
      this.events.publish('userLogged',data);
    }
  }

 
}

showConfirm() {
  const confirm = this.alertCtrl.create({
    message: '¿Desea cambiar de modo Usuario a modo Trabajador? ',
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

  countActiveHirings(){

    if(localStorage.getItem('token') != null){
      var headers = new HttpHeaders({
        Authorization: localStorage.getItem('token'),
      });
      this.httpClient.post(this.url+'/api/countActive/hiring', {"user_id": localStorage.getItem('user_id')})
      .subscribe((response:any)=> {
       
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
  

  /*constructor(private statusBar: StatusBar, public toastController: ToastController,public navCtrl: NavController, public modalCtrl: ModalController,private menu: MenuController,public httpClient: HttpClient,public events: Events,private localNotifications: LocalNotifications,private alertCtrl: AlertController, private plt: Platform,public viewCtrl: ViewController, private app: AppVersion, private transfer: FileTransfer, private file: File, private serviceUrl: ServiceUrlProvider, private fileOpener: FileOpener, private ngZone: NgZone) {

    this.url = this.serviceUrl.getUrl()
    this.plt.ready().then((readySource) => {
      if (this.plt.is('android')) {
        var me = this;
        this.app.getVersionNumber().then(value => {
          
          this.update(value)

        }).catch(err => {
          console.log(err);
        });
      }
      

      

      this.statusBar.backgroundColorByHexString('#7f0093');

     
    });

  } //Constructor

  ionViewDidLoad() {
    
    this.validateSession();


  }

presentAlert(data) {
  let alert = this.alertCtrl.create({
    title: "Alerta",
    subTitle:  'entro',
    buttons: ['Ok']
  });
  alert.present();
  }

  async redirectDetailHiringNotification(data) {
    const toast = await this.toastController.create({
      message: 'Esta siendo redigirido a las solicitud',
      duration: 2000
    });
    toast.present();
    this.navCtrl.setRoot("DetailHiringNotificationPage",{data:data});

  }

  goToLogin(){
    this.navCtrl.push("LoginPage"); // nav
  }

  goToRegister(){
    this.navCtrl.push("RegisterPage"); // nav
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


 
  validateSession(){
    
    if(localStorage.getItem('token') != null){
      let data = {
        user:{
          name:localStorage.getItem('user')
        },
        image:localStorage.getItem('userimage'),
        token:localStorage.getItem('token'),
        tokenCode:localStorage.getItem('tokenCode'),
        roles:[
          {
            id:localStorage.getItem('user_rol')
          }
        ]
      }

      //console.log("test-data", data)

      if(localStorage.getItem('user_rol') == "1"){
        this.navCtrl.setRoot("TrayaPage");
        this.events.publish('userLogged',data);
      }else if(localStorage.getItem('user_rol') == "2"){
        this.navCtrl.setRoot("TrayaBidderPage");
        this.events.publish('userLogged',data);
      }else if(localStorage.getItem('user_rol') == "3"){
        this.navCtrl.setRoot("HomeAdminPage");
        this.events.publish('userLogged',data);
      }else if(localStorage.getItem('user_rol') == "4"){
        this.navCtrl.setRoot("HomeAdminPage");
        this.events.publish('userLogged',data);
      }
    }

   
}

updateTest(){

  const fileTransfer = this.transfer.create(); //this.tranfer is from "@ionic-native/file-transfer";
    let fileUrl = this.url+"/traya.apk";
    console.log(fileUrl)
  const savePath = this.file.externalRootDirectory  + '/Download/' + 'traya.apk';
  
    fileTransfer.onProgress((progressEvent) => {
      this.ngZone.run(() => {
      //console.log(progressEvent);
      var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      console.log(perc)
      this.downProg = perc;
      })
    });
    fileTransfer.download(fileUrl, savePath)
    .then((entry) => {

      const nativePath = entry.toURL();
      alert(nativePath)
      this.runNewVersionApk(nativePath);
    }, (err) => {
      console.log(err)
      alert("SERVER ERROR TO DOWNLOAD FILE")
    });

}

runNewVersionApk(path) {
  //this.fileOpener is from '@ionic-native/file-opener';
  this.fileOpener.open(path, 'application/vnd.android.package-archive');
}

update(app_version){ //la funcion

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    return  this.httpClient.post(this.url+"/api/updateapk", {"versionApk": app_version})
    .pipe()
    .subscribe((res:any)=> {
   var versionToday = res.data;
    console.log("test-update", res.data);
    //console.log(versionToday);
    if (versionToday==true){
        this.closeModal();
      }else{
      let modal=this.modalCtrl.create("UpdateModalPage");
      modal.present();
      //this.menu.swipeEnable(false);
      console.log('app antigua');
      }
    },err => {
    } ); 
  }

  closeModal() {  //cierra el modal
    this.viewCtrl.dismiss();
  }*/

}
