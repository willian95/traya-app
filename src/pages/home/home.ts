import { Component } from '@angular/core';
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
import { NgZone } from '@angular/core';

@IonicPage()

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  url:any;
  protected app_version: any;
  downProg = 0
  

  constructor(private statusBar: StatusBar, public toastController: ToastController,public navCtrl: NavController, public modalCtrl: ModalController,private menu: MenuController,public httpClient: HttpClient,public events: Events,private localNotifications: LocalNotifications,private alertCtrl: AlertController, private plt: Platform,public viewCtrl: ViewController, private app: AppVersion, private transfer: FileTransfer, private file: File, private serviceUrl: ServiceUrlProvider, private fileOpener: FileOpener, private ngZone: NgZone) {

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
      

      // let status bar overlay webview
      //this.statusBar.overlaysWebView(true);

      this.statusBar.backgroundColorByHexString('#7f0093');

      //this.update(); //llamo la funcion en la carga
      /*this.localNotifications.on('click', function(notification,data){
        me.redirectDetailHiringNotification(notification.data);
        me.presentAlert(notification.data)
        // me.redirectDetailHiringNotification(data);

      })*/
    });

  } //Constructor

  ionViewDidLoad() {
    
    this.validateSession();

    /*this.events.subscribe('notifiticarionHiring',(res)=>{
      this.redirectDetailHiringNotification2(res.id)
    });*/


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

    /*if(localStorage.getItem('token') != null){
      var headers = new HttpHeaders({
        Authorization: localStorage.getItem('token'),
      });
      this.httpClient.get(this.url+'/api/auth/user', { headers })
      .subscribe((response:any)=> {
        
        this.menu.swipeEnable(true);
        this.events.publish('userLogged',response);
        if(response.roles[0].id== 1){
          
          this.httpClient.post(this.url+'/api/fcm/token/update', {"user_id": localStorage.getItem("user_id"), "deviceToken": localStorage.getItem('fcmToken')})
          .subscribe((res:any) => {
            console.log("validate", res)
            this.navCtrl.setRoot("TrayaPage");
               //this.navCtrl.insert(0,"TrayaPage");
               //this.navCtrl.popToRoot();
            this.events.publish('userLogged',response);
          })

          
        }else if(response.roles[0].id==2 && response.services == ''){
          this.httpClient.post(this.url+'/api/fcm/token/update', {"user_id": localStorage.getItem("user_id"), "devideToken": localStorage.getItem('fcmToken')})
          .subscribe((res:any) => {
            console.log("validate", res)
            this.navCtrl.setRoot("ServicesJobPage");
            this.events.publish('userLogged',response);
          })
          
        }else if(response.roles[0].id==2 && response.services != ''){
          console.log("test-validad-sesion", response)
          this.httpClient.post(this.url+'/api/fcm/token/update', {"user_id": localStorage.getItem("user_id"), "devideToken": localStorage.getItem('fcmToken')})
          .subscribe((res:any) => {
            console.log("validate", res)
            this.navCtrl.setRoot("TrayaBidderPage");
            this.events.publish('userLogged',response);
          })

          
        }
        else if(response.roles[0].id ==3){
          this.navCtrl.setRoot("HomeAdminPage");
          this.events.publish('userLogged',response);
        }

        else if(response.roles[0].id ==4){
          this.navCtrl.setRoot("HomeAdminPage");
          this.events.publish('userLogged',response);
        }
      },
      err => {
        console.log('ERROR!: ', err);
      }
    );
  }else{
    console.log("sesion expirada");
  }*/
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
  }

}
