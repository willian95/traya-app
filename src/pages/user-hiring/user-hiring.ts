import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Events,Platform,ToastController,ActionSheetController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
// import { HttpClient } from '@angular/common/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ServicesPage } from '../services/services';
import { AlertController } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { NotificationPage } from '../notification/notification';
import { UserOpinionsPage } from '../user-opinions/user-opinions';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';
import { HiringsPage } from '../hirings/hirings';
import { SuperTabsController } from 'ionic2-super-tabs';
@IonicPage()
@Component({
  selector: 'page-user-hiring',
  templateUrl: 'user-hiring.html',
})
export class UserHiringPage {
  url:any;

  constructor( private superTabsCtrl: SuperTabsController,public actionSheetController: ActionSheetController,public toastController: ToastController,private plt: Platform,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,public navCtrl: NavController, public navParams: NavParams,public callNumber: CallNumber,public httpClient: HttpClient,public loadingController: LoadingController,private alertCtrl: AlertController,public events: Events,private serviceUrl:ServiceUrlProvider) {
    this.usersServices = navParams.get('data');
    this.loading = this.loadingController.create({content: 'Por favor espere...'});
    this.url=serviceUrl.getUrl();
    // LOCALNOTIFACTION
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
  usersServices:any;
  commentsCount:any;
  username:any;
  userimage:any;
  description:any;
  phone:any;
  user_id:any;
  bidder_id:any;
  services_id:any;
  loading:any;
  comments:any;
  last_conection:any;
  tokenCode:any;
  notificationArray:any;
  notificationNumber:any;
  averageRatingInt:any;
  servicesName:any;
  selectedOption:any;
  authEmail:any;
  rol_id:any
  authId:any

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
    const channel = this.pusherNotify.init();
    let self = this;
    channel.bind('notificationUser', function(data) {
      self.scheduleNotification(data.message,data.hiring.id);
    });

    this.showProfile();
    this.user_id = localStorage.getItem('user_id');
    this.authEmail = localStorage.getItem('useremail')
    this.getNotifications();
    this.rol_id = localStorage.getItem("user_rol")
    this.authId = localStorage.getItem("user_id")

  }
  countCharacter(event){
    this.commentsCount=this.comments.length;
    if (this.commentsCount ==300) {
      this.errorAlert('Excediste el límite de caracteres permitidos');
    }

  }

  createDescription() {
    console.log("lala");
    let alert = this.alertCtrl.create({
      title: 'Explica tus necesidades',
      inputs: [
      {
        name: 'comments',
        value: this.comments,
        placeholder: 'Explica brevemente tus necesidades'
      },

      ],
      buttons: [
      {
        text: 'Cerrar',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Agregar',
        handler: data => {
          if (data.comments !='') {
            this.comments = data.comments;
          } else {
            console.log("falso");
            return false;
          }
        }
      }
      ]
    });

    alert.present();
  }

  async viewServices() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
      {
        text: 'Servicio',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      },
      {
        text: 'Cerrar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  presentActionSheet() {
    var self = this;
    var options = [];
    for (var i = 0; i < this.usersServices.services.length; i++) {
      options.push(this.usersServices.services[i].service.name);
    }

    let actionSheet = this.actionSheetController.create({
      title: 'Servicios Asociados',
    });
    options.forEach(option => {
      actionSheet.addButton({
        icon: 'checkmark',
        text: option,
        handler: function() {
          self.selectedOption = this.text;
        }
      }
      )
    });

    actionSheet.addButton({
      text: 'Cerrar',
      icon: 'close',
      role: 'cancel'
    });

    actionSheet.present();
  }

  presentNotifications(){
    this.navCtrl.push(NotificationPage); // nav
  }


  async presentAlert() {
    const toast = await this.toastController.create({
      message: 'Felicitaciones! Tu solicitud ha sido enviada al trabajador',
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }


  async errorAlert(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

  getNotifications(){
    this.httpClient.get(this.url+"/api/notification/"+this.user_id+'?filters={"read":0}')
    .pipe()
    .subscribe((res:any)=> {
      this.notificationArray=res.data;
      this.notificationNumber = this.notificationArray.length;
    });
  }



  showProfile(){
    this.averageRatingInt = this.usersServices.averageRatingInt;
    this.bidder_id=this.usersServices.id;
    this.username = this.usersServices.name;
    this.description = this.usersServices.profile.description;
    this.userimage = this.usersServices.image;
    //this.phone = this.usersServices.profile.phone.substr(1);
    this.phone = this.usersServices.profile.phone;
    this.last_conection= this.usersServices.last_login;
    this.servicesName = localStorage.getItem('servicesName')
  }

  sendWhatsapp(tel){
    this.storeContact(1)

    window.open("whatsapp://send?text=¡Hola, te contacto desde Traya App de Servicios!&phone="+tel,"_system","location=yes");

  }

  storeContact(type){
      
    let contactType = ""
    if(type == 1){
      contactType = "whatsapp"
    }else{
      contactType = "telephone"
    }

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    this.tokenCode = localStorage.getItem('tokenCode');

    this.httpClient.post(this.url+"/api/hiring/contact", {"type": contactType, "receiver_id": this.bidder_id, "token": this.tokenCode}).pipe()
    .subscribe((res:any)=> {
       
    },err => {
        
    }); //subscribe

  }



  callNow() {

    this.storeContact(2)
    
    if(this.phone.charAt(0) != '+'){
      this.phone = "+"+this.phone
    }

    /*if(this.phone.charAt(1) != '+'){
      this.phone = "+"+this.phone
    }*/


    
    //alert(this.phone)

    this.callNumber.callNumber(this.phone, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }
  getHirings() {
    this.user_id = localStorage.getItem('user_id');
    this.httpClient.get(this.url+"/api/hiring?"+"user_id="+this.user_id)
    .pipe()
    .subscribe((res:any)=> {
    });
  }

  createHiring() {
    this.loading = this.loadingController.create({content: 'Por favor espere...'});
    this.loading.present();
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    this.tokenCode = localStorage.getItem('tokenCode');
    this.services_id = localStorage.getItem('services_id');
    return  this.httpClient.post(this.url+"/api/hiring", {"bidder_id":this.bidder_id,"service_id":this.services_id,"description":this.comments, "token":this.tokenCode})
    .pipe(
      )
    .subscribe((res:any)=> {
      this.loading.dismiss();
      this.presentAlert();
      this.superTabsCtrl.slideTo(1);
      this.events.publish('getHiringsEvent',res);
      this.comments='';
    },err => {
      this.loading.dismiss();
      console.log(err.error.errors);
    } ); //subscribe
  }
  showOpinions(){
    this.navCtrl.push(UserOpinionsPage,{data:this.usersServices});

  }

}
