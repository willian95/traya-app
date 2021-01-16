import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,ActionSheetController,AlertController, LoadingController, ToastController  } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ServiceUrlProvider } from '../providers/service-url/service-url';
import { PusherProvider } from '../providers/pusher/pusher';
//import { BackgroundMode } from '@ionic-native/background-mode';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { SocialSharing } from '@ionic-native/social-sharing';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { FCM } from '@ionic-native/fcm';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject  } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';

declare var cordova: any;


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
  locations:any;
  location:any;
  myRand:any;
  storage:any;
  rol_id:any = 0;
  config:any
  showNotifications:any
  userimage:any
  lastImage:any
  showClaimButton:any = false
  userLocalityName:any = "Teodelina"
  // hiring_id:any;
  text = '¡Descárgate Traya! es una App de Servicios…';
  textBody = 'te permite de manera rápida y sencilla conectarte con un profesional. \n'+
  'Comparte y Descarga nuestra aplicación: https://play.google.com/store/apps/details?id=com.ionicframework.traya';
  urlShare = 'https://play.google.com/store/apps/details?id=com.ionicframework.traya';
  validateHeaderMain:any;


  pages: Array<{title: string, component: any}>;
  appMenuItems:any;
  constructor(private localNotifications: LocalNotifications,private alertCtrl: AlertController,private socialSharing: SocialSharing,public actionSheetController: ActionSheetController, public loadingCtrl: LoadingController, /*public backgroundMode: BackgroundMode,*/ public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,public httpClient: HttpClient,public events: Events,private serviceUrl:ServiceUrlProvider,private pusher:PusherProvider, private push: Push, private fcm: FCM, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, private toastController: ToastController) {

    this.appMenuItems = [];
    this.initializeApp();
    this.url=serviceUrl.getUrl();
    

    this.storage = localStorage;
    this.validateHeaderMain=false;
    //this.backgroundMode.enable();
    this.getConfig()

    this.pushSetup();
    this.userLocalityName = localStorage.getItem("user_locality_name")

  }

  showModalLocation(){
    this.fetchLocaltions()

  }

  fetchLocaltions(){

    
    this.httpClient.get(this.url+"/api/locations")
    .subscribe((response:any) => {
      this.locations = response.data
  
      let options = []
      this.locations.forEach((data)=>{
  
        options.push({"type": "radio", "label": data.name, "value": data.id})
  
      })


      console.log("modal locations Show")
  
      let alert = this.alertCtrl.create({
        title: 'Selecciona una localidad',
        inputs: options,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'OK',
            handler: (data) => {
              if(data){
                this.location = data
                var locationChangeName = ""
                this.locations.forEach((data) =>{

                  if(this.location == data.id)
                    locationChangeName = data.name

                })

                //console.log("locality_name", locationChangeName)
                localStorage.setItem("user_locality_id", this.location)
                localStorage.setItem("user_locality_name", locationChangeName)

                this.events.publish("userLocationChanged")
              }
              // I NEED TO GET THE VALUE OF THE SELECTED RADIO BUTTON HERE
            }
          }
        ]
      });
      alert.present();
    })
  
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
      this.appMenuItems.push(
        {title: 'Servicios', component: "TrayaPage", icon: 'people'},
        {title: 'Favoritos', component: "FavoriteTabsPage", icon: 'heart'},
        {title: 'Chats', component: "ChatsPage", icon: 'chatboxes'},
        /**,{title: 'Acerca de TRAYA', component: AboutTrayaPage, icon: 'information-circle'}*/);
    }else if(this.rol_id ==2){
      this.appMenuItems.push(
        {title: 'Solicitudes de Trabajo', component: "TrayaBidderPage", icon: 'list'},
        {title: 'Mis Servicios', component: "ServicesJobPage", icon: 'add-circle'},
        {title: 'Chats', component: "ChatsPage", icon: 'chatboxes'}
      )
      }else if(this.rol_id ==3){
      this.appMenuItems.push(
        {title: 'Registrar Servicios', component: "RegisterServicesLocationsPage", icon: 'add-circle'},
        {title: 'Actualizar Servicios', component: "UpdateServicesPage", icon: 'refresh-circle'},
        {title: 'Crear Localidades', component: "CreateLocalityPage", icon: 'locate'},
        {title: 'Gestionar Localidades', component: "UpdateLocalityPage", icon: 'refresh'},
        {title: 'Línea de reclamos', component: "AdminClaimsPage", icon: 'information-circle'},
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

    this.events.subscribe('userLocationChanged',(res)=>{
      //if(localStorage.getItem('token')==null){
        this.userLocalityName = localStorage.getItem("user_locality_name")
      //}
      
      //this.validarMenu();
    })

    this.events.subscribe('localityChange',(res)=>{
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
      this.fetchClaim()
      
      this.validateHeaderMain=true;
    });


     this.events.subscribe('userImage',(res)=>{
       //this.myRand=this.random();
       let rand = Math.random()
       this.image = ""
      this.image = res.image+"?"+rand;
    
      window.localStorage.setItem('userimage', this.image)
    })

    this.events.subscribe("userCamera", () => {

      let rand = Math.random()
       this.image = ""
       let userId = localStorage.getItem('user_id');
      this.image = this.url+"/profiles/"+userId+".jpg"+"?"+rand;
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
      this.userLocalityName = localStorage.getItem("user_locality_name")
      this.fetchClaim()
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
      this.showClaimButton = false
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
      
      console.log("test-notification", notification)
      //let json = JSON.parse(notification.message);
      //this.nav.setRoot("HiringDetailsPage")
      /*if(notification.page == "hiring"){
        this.nav.push(HiringDetailsPage, {data: notification.hiring});
      }*/

      var serverNotification = notification
      
      if(serverNotification.additionalData.type == "chat"){
        localStorage.setItem("chatId", serverNotification.additionalData.bidder_id)  
      }else if(serverNotification.additionalData.hiring_id){
        localStorage.setItem("notificationId", serverNotification.additionalData.hiring_id)
      }

      if (notification.additionalData.foreground) {

        this.localNotifications.schedule({
          id: 1,
          title: notification.title,
          text: notification.message
        });

        console.log("test-foreground", serverNotification)

        if(serverNotification.additionalData.type == "chat"){
          localStorage.setItem("chatId", serverNotification.additionalData.bidder_id)  
        }else if(serverNotification.additionalData.hiring_id){
          localStorage.setItem("notificationId", serverNotification.additionalData.hiring_id)
        }

      }
      
      if(notification.additionalData.coldstart){

        //alert("hey")

        console.log("test-coldstart", serverNotification)

        if(serverNotification.additionalData.type == "chat"){
          localStorage.setItem("chatId", serverNotification.additionalData.bidder_id)  
        }else if(serverNotification.additionalData.hiring_id){
          localStorage.setItem("notificationId", serverNotification.additionalData.hiring_id)
        }
        /*this.localNotifications.schedule({
          id: 1,
          title: notification.title,
          text: notification.message
        });*/

        /*this.localNotifications.on('click', (notification, state) => {
          console.log("test-local-notification", serverNotification)
          this.httpClient.get(this.url+"/api/hiring/"+serverNotification.additionalData.hiring_id)
          .pipe()
            .subscribe((res:any)=> {
              this.nav.push("HiringDetailsPage",{data:res});
          });

        });*/

      }

      

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

  chooseImageSource() {
    const actionSheet = this.actionSheetController.create({
      //title: 'Modify your albu',
      buttons: [
        {
          text: 'Cámara',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA)
          }
        },{
          text: 'Archivos',
          handler: () => {
            this.openGallery()
            //document.getElementById('image-change-app').click();
          }
        }
      ]
    });
    actionSheet.present();
  }

  convertBase64(event) {
    var input = event.target;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = (e:any) => {
        this.userimage = e.target.result;
        this.updateProfileImage()
      }
      reader.readAsDataURL(input.files[0]);
      
    }
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    let userId = localStorage.getItem('user_id');
    var url = this.url+"/api/user/update/camera/"+userId;
    var targetPath = this.pathForImage(this.lastImage);
    var filename = this.lastImage;
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };

    const fileTransfer: TransferObject = this.transfer.create();
    var loading = this.loadingCtrl.create({
      content: 'Subiendo imagen...',
    });
    loading.present();
    fileTransfer.upload(targetPath, url, options).then(data => {
      console.log(data)
      loading.dismissAll()
      this.events.publish('userCamera');
      
      this.presentToast('Imagen actualizada');
    }, err => {
      console.log(err)
      loading.dismissAll()
      this.presentToast('Hubo un error en el servidor');
    });
  }

  updateProfileImage(){
    
      var loading = this.loadingCtrl.create({
          content: 'Por favor espere...'
      });
      loading.present();
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      this.token = localStorage.getItem('tokenCode');
      let userId = localStorage.getItem('user_id');

      return  this.httpClient.post(this.url+"/api/user/update/image", {image: this.userimage, userId: userId, token: this.token})
      .pipe()
      .subscribe((res:any)=> {
     
        loading.dismiss();
        this.events.publish('userImage',res);
        this.userimage = null
        this.presentToast('Imagen actualizada');
        //document.getElementById('image-change-app').value = null;

      },err => {
         loading.dismiss();
        console.log(err.error);
        this.presentToast('Hubo un error al subir la imagen');
      } ); //subscribe
  }

  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

  public takePicture(sourceType) {
    var options = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      this.userimage  = 'data:image/jpeg;base64,' + imageData;
      this.updateProfileImage()

    }, (err) => {
      console.log(err)
    });
  }

  openGallery(){

    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.userimage  = 'data:image/jpeg;base64,' + imageData;
      this.updateProfileImage()
    }, (err) => {
      // Handle error
    })
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage()
    }, error => {
      console.log(error)
      //this.presentToast('Error while storing file.');
    });
  }

  viewClaims(){
    this.nav.push("ClaimsPage");
  }

  fetchClaim(){
    this.showClaimButton = false
    this.httpClient.get(this.url+"/api/claim-locality")
    .subscribe((response:any) => {
      
      var userLocality = window.localStorage.getItem("user_locality_id")
      console.log("fetchClaim", response, userLocality)
      response.locations.forEach((data) => {

        if(data.location.id == userLocality && data.emails != null && data.active == 1){
          this.showClaimButton = true
          
        }

      })

    })

  }

}
