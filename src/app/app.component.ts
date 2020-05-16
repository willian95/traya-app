import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,ActionSheetController,AlertController  } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ServiceUrlProvider } from '../providers/service-url/service-url';
import { PusherProvider } from '../providers/pusher/pusher';
import { BackgroundMode } from '@ionic-native/background-mode';


import { LocalNotifications } from '@ionic-native/local-notifications';

import { SocialSharing } from '@ionic-native/social-sharing';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { FCM } from '@ionic-native/fcm';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  url:any;
  rootPage: any = "HomePage";
  name:any;
  image:any;
  token:any;
  tokenCode:any;
  myRand:any;
  storage:any;
  rol_id:any;
  config:any
  showNotifications:any
  // hiring_id:any;
  text = '¡Descárgate Traya! es una App de Servicios…';
  textBody = 'te permite de manera rápida y sencilla conectarte con un profesional. \n'+
  'Comparte y Descarga nuestra aplicación: https://play.google.com/store/apps/details?id=com.ionicframework.traya';
  urlShare = 'https://play.google.com/store/apps/details?id=com.ionicframework.traya';
  validateHeaderMain:any;


  pages: Array<{title: string, component: any}>;
  appMenuItems:any;
  constructor(private localNotifications: LocalNotifications,private alertCtrl: AlertController,private socialSharing: SocialSharing,public actionSheetController: ActionSheetController,public backgroundMode: BackgroundMode,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,public httpClient: HttpClient,public events: Events,private serviceUrl:ServiceUrlProvider,private pusher:PusherProvider, private push: Push, private fcm: FCM) {
    this.appMenuItems = [];
    this.initializeApp();
    this.url=serviceUrl.getUrl();
    this.storage = localStorage;
    this.validateHeaderMain=false;
    this.backgroundMode.disable();
    this.getConfig()

    this.pushSetup();

     /*platform.ready().then(() => {

      if (platform.is('cordova')){

        //Subscribe on pause i.e. background
        this.platform.pause.subscribe(() => {
          //console.log("paused");
          this.showNotifications = false
        });

        //Subscribe on resume i.e. foreground 
        this.platform.resume.subscribe(() => {
          window['paused'] = 0;
          this.showNotifications = true
          //console.log("resume");
        });
       }
    });*/


    /*this.fcm.onNotification().subscribe(notification => {
      if(notification.wasTapped){
        console.log("Received in background");
      } else {
        let alert = alertCtrl.create({
          title: "titulo",
          subTitle: "subtitulo"
        });
        alert.present();
      };
    })*/

      /*if(this.showNotifications == true){
        this.localNotifications.on('click', (notification, state) => {
          let json = JSON.parse(notification.data);
    
          let alert = alertCtrl.create({
            title: notification.title,
            subTitle: json.mydata
          });
          alert.present();
        })
      }*/

  }


  tokenRefresh(){
      var headers = new HttpHeaders({
        Authorization: localStorage.getItem('token'),
      });
      if (localStorage.getItem('token')==null){
        this.httpClient.get(this.url+'/api/token/refresh', { headers })
      .subscribe((response:any)=> {
        console.log(response);
      },
      err => {
        console.log('ERROR!: ', err);
      }
    );
      }
    
}


  validarMenu(){
    
    this.appMenuItems=[];
    if(this.rol_id == 1){
      this.appMenuItems.push({title: 'Servicios', component: "TrayaPage", icon: 'people'}/**,{title: 'Acerca de TRAYA', component: AboutTrayaPage, icon: 'information-circle'}*/);
    }else if(this.rol_id ==2){
      this.appMenuItems.push(
        {title: 'Solicitudes de Trabajo', component: "TrayaBidderPage", icon: 'list'},
        {title: 'Mis Servicios', component: "ServicesJobPage", icon: 'add-circle'}/*,{title: 'Acerca de TRAYA', component: AboutTrayaBidderPage, icon: 'information-circle'}*/);
    }else if(this.rol_id ==3){
      this.appMenuItems.push(
        {title: 'Registrar Servicios', component: "RegisterServicesLocationsPage", icon: 'add-circle'},
        {title: 'Actualizar Servicios', component: "UpdateServicesPage", icon: 'refresh-circle'},
        {title: 'Crear Localidades', component: "CreateLocalityPage", icon: 'locate'},
        {title: 'Gestionar Localidades', component: "UpdateLocalityPage", icon: 'refresh'},
        {title: 'Usuarios Activos', component: "ManageUsersPage", icon: 'contacts'},
        {title: 'Usuarios Inactivos', component: "DisabledUsersPage", icon: 'close'},
        {title: 'Modo mantenimiento', component: "MaintenanceModePage", icon: 'build', badge: this.config},
        {title: 'Administradores de localidades', component: "ManageAdministratorsPage", icon: 'pin'},
        {title: 'Estadísticas de usuarios', component: "StatisticsPage", icon: 'trending-up'},
        {title: 'Publicidad', component: "AdsLocationsPage", icon: 'pricetag'});
    }else if(this.rol_id == 4){
      this.appMenuItems.push(
        {title: 'Registrar Servicios', component: "RegisterServicesPage", icon: 'add-circle'},
        {title: 'Actualizar Servicios', component: "UpdateServicesPage", icon: 'refresh-circle'},
        {title: 'Gestionar Notificaciones', component: "DetailsLocalityPage", icon: 'add-circle'},
        {title: 'Usuarios Activos', component: "ManageUsersPage", icon: 'add-circle'},
        {title: 'Usuarios Inactivos', component: "DisabledUsersPage", icon: 'add-circle'},
        {title: 'Estadísticas de usuarios', component: "StatisticsPage", icon: 'trending-up'},
        //{title: 'Publicidad', component: "AdminAdsPage", icon: 'pricetag'}
      );
    }
  }


  viewContactPage(){
    this.nav.push("ContactPage");
  }

  viewServicesJobPage(){
    this.nav.push("ServicesJobPage")
  }

  viewAboutTrayaPage(){
    if(this.rol_id == 1){
    this.nav.push("AboutTrayaPage");
    }else{
      this.nav.push("AboutTrayaBidderMenuPage");
    }
  }
   viewLoginPage(){
    this.nav.push("LoginPage");
  }

 viewRegisterPage(){
    this.nav.push("RegisterPage");
  }
  viewProfilePage(){
    this.nav.push("ProfilePage");

  }
  


 async shareApplication() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Vía WhatsApp',
        icon: 'logo-whatsapp',
        handler: () => {
          this.shareWhatsApp();
        }
      }, {
        text: 'Vía Twitter',
        icon: 'logo-twitter',
        handler: () => {
          this.shareTwitter();

        }
      }, {
        text: 'Vía Email',
        icon: 'mail',
        handler: () => {
          this.shareEmail();
        }
      }, {
        text: 'Vía Facebook',
        icon: 'logo-facebook',
        handler: () => {
        this.shareFacebook();
        }
      }, {
        text: 'Cerrar',
        icon: 'close',
        role: 'cancel',
        cssClass:'cancelButton',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  /****FUNCIONES PARA COMPARTIR LAS APLICACIONES****/
  async shareTwitter() {
    // Either URL or Image
    this.socialSharing.shareViaTwitter(null, null, this.text+"\n"+this.textBody+"\n"+this.urlShare).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }

  async shareWhatsApp() {
    // Text + Image or URL works
    this.socialSharing.shareViaWhatsApp(this.text+"\n"+this.textBody, null, null).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }
  async shareInstagram() {
    // Text + Image or URL works
    this.socialSharing.shareViaWhatsApp(this.text, null, this.urlShare).then(() => {
      // Success
    }).catch((e) => {
      // Error!
    });
  }

  async shareEmail() {
    this.socialSharing.shareViaEmail(this.text+"\n"+this.textBody+"\n"+this.urlShare, 'Traya', [''], null, null, null).then(() => {
    }).catch((e) => {
      // Error!
    });
  }

  async shareFacebook() {
    this.socialSharing.shareViaFacebook(null, null).then(() => {
    }).catch((e) => {
      // Error!
    });
  }


 random(): number {
   let rand = Math.floor(Math.random()*20)+1;
   return rand;
}

initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  

    this.events.subscribe('userRol',(res)=>{
        this.rol_id=res;
        this.getConfig()
        //this.validarMenu();
    })
    

    this.events.subscribe('userLogged',(res)=>{
      this.name = res.user.name;
      let rand = Math.random()
      this.image = res.image+'?'+rand;
      //this.image = res.image
      this.token = res.token;
      this.tokenCode = res.tokenCode;
      this.rol_id = res.roles[0].id;
      //this.validarMenu();
      this.getConfig()
      this.validateHeaderMain=true;
    });


     this.events.subscribe('userImage',(res)=>{
       //this.myRand=this.random();
       let rand = Math.random()
       this.image = ""
      this.image = res.image+"?"+rand;
      window.localStorage.setItem('userimage', this.image)
    })

    this.events.subscribe('maintenance', (res)=>{
      this.getConfig()
      this.validarMenu()
   })

    this.events.subscribe('userName',(res)=>{
      console.log(res)
      this.myRand=this.random();
      this.name = res.user.name
      window.localStorage.setItem('user', this.name)
    })

     this.events.subscribe('userLogout',(res)=>{
      this.validateHeaderMain=false;
    });

    this.events.subscribe('localityEvent',(res)=>{
        localStorage.setItem('descriptionEventTweet',res);
        this.toastTweet(res);
    });
  }

 toastTweet(message) {
    this.localNotifications.schedule({
      id: 1,
      title: 'Atención',
      text: message,
      sound: null
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    
     this.nav.setRoot(page.component);
    
   

  }
  goToProfile(){
    this.nav.setRoot("ProfilePage");
  }


   confirmLogout() {
      let alert = this.alertCtrl.create({
        title: '  <img src="assets/imgs/info.png" class="logo2" />',
        message: ' ¡No estarás conectado! ¿Seguro deseas cerrar la sesión? ',
        buttons: [
          {
            text: 'Si',
            //role: 'cancel',
            handler: () => {
              this.cerrarSesion();
            }
          },
          {
            text: 'No',
            //role: 'cancel',
            handler: () => {
              console.log('Buy clicked');
            }
          }
        ]
      });
      alert.present();
    }

  /**LOGOUT**/
  clearKeys() {
    //this.storage.clear();
    this.storage.removeItem('useremail');
    this.storage.removeItem('location_description');
    this.storage.removeItem('userimage');
    this.storage.removeItem('userphone');
    this.storage.removeItem('userdescription');
    this.storage.removeItem('user_rol');
    this.storage.removeItem('user_locality_id');
    this.storage.removeItem('user_id');
    this.storage.removeItem('user_domicile');
    this.storage.removeItem('user');
    this.storage.removeItem('token');
    this.storage.removeItem('tokenCode');
    this.storage.removeItem('indexTab');
    this.storage.removeItem('status_id');
    this.storage.removeItem('contratactionNumber');
    this.storage.removeItem('averageRatingInt');
    this.storage.removeItem('pusherTransportTLS');
  }
  cerrarSesion() {
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    return  this.httpClient.post(this.url+"/api/auth/logout", {"token":localStorage.getItem('tokenCode')})
    .pipe(
    )
    .subscribe((res:any)=> {
      this.appMenuItems=[];
      this.clearKeys();
      this.events.publish('userLogout',res);
      this.nav.setRoot("HomePage");
    },err => {
    } ); //subscribe
  }

  pushSetup(){
    const options: PushOptions = {
       android: {
           // Añadimos el sender ID para Android.
           senderID: '294800992208'
       },
       ios: {
           alert: 'true',
           badge: true,
           sound: 'false'
       }
    };
 
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((registration: any) => {
      //alert("fcmtoken "+registration.registrationId)
      if(registration != null){
        if(registration.registrationId != null){
          localStorage.setItem("fcmToken", registration.registrationId)
        }
      }
      
      //alert("test-fcmtoken "+registration.registrationId);
    });
    pushObject.on('notification').subscribe((notification: any) => {
      
      //let json = JSON.parse(notification.message);
      this.nav.setRoot("HiringDetailsPage")
      /*if(notification.page == "hiring"){
        this.nav.push(HiringDetailsPage, {data: notification.hiring});
      }*/

      this.localNotifications.schedule({
        id: 1,
        title: notification.title,
        text: notification.message
      });

    });
    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  async getConfig(){
    
    if(localStorage.getItem('token') != null){

      var headers = new HttpHeaders({
        Authorization: localStorage.getItem('token'),
        Accept: "application/json",
      });
  
      return  this.httpClient.get(this.url+"/api/config", {headers})
      .pipe()
      .subscribe((res:any)=> {
        //console.log("config: ",res)
        this.config = res.data.active
        this.validarMenu()
      },err => {
      } ); //subscribe

    }
    

  }


}
