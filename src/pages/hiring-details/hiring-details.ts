import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ActionSheetController,Events,Platform,ToastController,ModalController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AlertController } from 'ionic-angular';
import { HiringsPage } from '../hirings/hirings';
import { CallNumber } from '@ionic-native/call-number';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { NotificationPage } from '../notification/notification';
import { ActiveHiringsPage } from '../active-hirings/active-hirings';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';
import { ModalInformationPage } from '../modal-information/modal-information';
import { ServicesPage } from '../services/services';
import { SuperTabsController } from 'ionic2-super-tabs';
@IonicPage()
@Component({
  selector: 'page-hiring-details',
  templateUrl: 'hiring-details.html',
})
export class HiringDetailsPage {
  url:any;
  qualifyValue:any;
  constructor(private superTabsCtrl: SuperTabsController,public modalCtrl: ModalController,public toastController: ToastController,public events: Events,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private alertCtrl: AlertController,public actionSheetController: ActionSheetController,public callNumber: CallNumber,private serviceUrl:ServiceUrlProvider,private pusherNotify: PusherProvider,private plt: Platform,private localNotifications: LocalNotifications) {
    this.detailsHirings = navParams.get('data');
    this.loading = this.loadingController.create({
             content: 'Por favor espere...'
         });
    this.url=serviceUrl.getUrl();
    
         events.subscribe('star-rating:changed',
         (starRating) =>  {
           this.qualifyValue = starRating;
         });

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
  detailsHirings:any;
  bidder:any;
  opinionCount:any;
  applicantName:any;
  applicantDescription:any;
  applicantPhone:any;
  applicantImage:any;
  applicant_id:any;

  bidderName:any;
  bidderDescription:any;
  bidderPhone:any;
  bidderImage:any;
  bidder_id:any;
  rol_id:any;
  servicesName:any;
  method:any;
  hiring_id:any;
  loading:any;
  status:any;
  hide:any;
  token:any;
  tokenCode:any
  qualificationValue:any;
  comment:any;
  user_id:any;
  hiringsArray:any;
  notificationArray:any;
  notificationNumber:any;
  contratactionNumber:any;
  fieldName:any;
  hiringDescription:any;
  selectedOption:any;


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



    this.hide=0;
    this.user_id = localStorage.getItem('user_id');
    this.rol_id = localStorage.getItem('user_rol');
    this.status = localStorage.getItem('status');
    this.bidder=this.detailsHirings.bidder;
    this.servicesName = this.detailsHirings.service;
    this.status= this.detailsHirings.status;
    this.contratactionNumber=localStorage.getItem('contratactionNumber');
    this.hiringDescription = this.detailsHirings.description;
    console.log(this.hiringDescription);
    this.showApplicant();
    this.showBidder();
    this.getNotifications();

    if (this.detailsHirings.status_id == 2 && this.rol_id ==1) {
        if(localStorage.getItem('bidder_on') == null){
        localStorage.setItem('bidder_on','false');
        const infoModal = this.modalCtrl.create(ModalInformationPage);
        infoModal.present();
      }else if(localStorage.getItem('bidder_on') == 'false'){
         const infoModal = this.modalCtrl.create(ModalInformationPage);
        infoModal.present();
      }
    }

  }
  presentNotifications(){
    this.navCtrl.push(NotificationPage); // nav
  }
  getNotifications(){
    this.httpClient.get(this.url+"/api/notification/"+this.user_id+'?filters={"read":0}')
    .pipe()
    .subscribe((res:any)=> {
      this.notificationArray=res.data;
      this.notificationNumber = this.notificationArray.length;
    });
  }



  async presentAlert(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

 countCharacter(event){
      this.opinionCount=this.comment.length;
        if (this.opinionCount ==300) {
         this.errorAlert('Excediste el límite de caracteres permitidos');
      }
     }


    confirmAlert() {
      let alert = this.alertCtrl.create({
        title: ' <img src="assets/imgs/info.png" class="logo2" />',
        message: '¿Está seguro que desea cancelar la solicitud?',
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'Si',
            role: 'cancel',
            handler: () => {
              this.cancelHiring();
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Buy clicked');
            }
          }
        ]
      });
      alert.present();
    }

  showDescription() {
  let alert = this.alertCtrl.create({
    title: "Descripción de la solicitud",
    subTitle: this.hiringDescription,
    buttons: ['Ok']
  });
  alert.present();
}

 servicesActionSheet() {
      var self = this;
      var options = [];
      for (var i = 0; i < this.detailsHirings.bidder.services.length; i++) {
         options.push(this.detailsHirings.bidder.services[i].service.name);
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


async presentActionSheet() {
   const actionSheet = await this.actionSheetController.create({
     // header: 'Llamadas',
     buttons: [{
       text: 'Teléfono',
       role: 'destructive',
       icon: 'call',
       handler: () => {
         this.callNow();
         // console.log('Delete clicked');
       }
     }, {
       text: 'Mensaje Whatsapp',
       icon: 'logo-whatsapp',
       handler: () => {
         this.sendWhatsapp();
       }
     },  {
       text: 'Cancelar',
       icon: 'close',
       role: 'cancel',
       handler: () => {
         console.log('Cancel clicked');
       }
     }]
   });
   await actionSheet.present();
 }

 async presentActionSheetApplicant() {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Llamadas',
      buttons: [{
        text: 'Teléfono',
        role: 'destructive',
        icon: 'call',
        handler: () => {
          this.callNowApplicant();
          // console.log('Delete clicked');
        }
      }, {
        text: 'Mensaje Whatsapp',
        icon: 'logo-whatsapp',
        handler: () => {
          this.sendWhatsappApplicant();
        }
      },  {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
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

  showApplicant(){
    this.applicant_id =this.detailsHirings.applicant.id;
    this.applicantName=this.detailsHirings.applicant.name;
    this.applicantDescription=this.detailsHirings.applicant.description;
    this.applicantPhone = this.detailsHirings.applicant.phone;
    this.applicantImage = this.detailsHirings.applicant.image;


  }

  

  showBidder(){
    this.bidder_id =this.detailsHirings.bidder.id;
    this.bidderName=this.detailsHirings.bidder.name;
    this.bidderDescription=this.detailsHirings.bidder.description;
    this.bidderPhone = this.detailsHirings.bidder.phone;
    this.bidderImage = this.detailsHirings.bidder.image;
  }
  getHirings() {
    this.user_id = localStorage.getItem('user_id');
  this.httpClient.get(this.url+"/api/hiring?"+"user_id="+this.user_id)
  .pipe()
    .subscribe((res:any)=> {
    this.hiringsArray=res.data;
  });
  }
  getHiringsActive() {
    
    this.user_id = localStorage.getItem('user_id');
  this.httpClient.get(this.url+"/api/hiring?"+"user_id="+this.user_id+'&filters={"status_id":[1,2,3]}')
  .pipe()
    .subscribe((res:any)=> {
      
      this.hiringsArray=res.data;

  });
  }
  /****METODO PARA LLAMAR VIA TELEFONO*****/
  callNow() {

    this.storeContact(2)

    //alert("++"+this.bidderPhone)

      this.callNumber.callNumber("+"+this.bidderPhone, true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));
    }

    sendWhatsapp(){
      //alert('hey')
      //window.location.href="https://wa.me/"+this.bidderPhone.substr(1);
      this.storeContact(1)
      window.open("whatsapp://send?text=¡Hola, te contacto desde Traya App de Servicios!&phone="+this.bidderPhone,"_system","location=yes");
      //window.open("whatsapp://send?text=¡Hola, te contacto desde Traya App de Servicios!&phone="+this.bidderPhone.substr(1),"_system","location=yes");
      /*https://api.whatsapp.com/send?phone="+this.bidderPhone.substr(1)+"&text=&source=&data=";*/

    }

    callNowApplicant(){

      this.storeContact(2)

      this.callNumber.callNumber("+"+this.applicantPhone, true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));
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
         console.log(res)
      },err => {
          
      }); //subscribe

    }

    sendWhatsappApplicant(){
      this.storeContact(1)
      //alert('hey')
      //window.location.href="https://wa.me/"+this.applicantPhone.substr(1);
      window.open("whatsapp://send?text=¡Hola, te contacto desde Traya App de Servicios!&phone="+this.applicantPhone,"_system","location=yes");
      /*https://api.whatsapp.com/send?phone="+this.applicantPhone.substr(1)+"&text=&source=&data=";*/

    }

    /****METODO PARA CREAR LA CONTRATACION***/
    createHiring(){
      this.loading.present();
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      this.tokenCode = localStorage.getItem('tokenCode');
      this.method='PUT';
      this.hiring_id=this.detailsHirings.id;
      return  this.httpClient.post(this.url+"/api/hiring", {"status_id":2, "_method":this.method,"hiring_id":this.hiring_id,"token":this.tokenCode})
        .pipe(
        )
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.presentAlert(res.msg);
          this.navCtrl.setRoot(ActiveHiringsPage);
          this.getHiringsActive();
         },err => {
          this.loading.dismiss();
          this.errorAlert('Ha ocurrido un error');
         
      }); //subscribe
    }

  /***METODO PARA CANCELAR LA CONTRATACION : DEMANDANTE***/
  cancelHiring(){
     this.loading = this.loadingController.create({
        content: 'Por favor espere...'
      });
     
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    this.tokenCode = localStorage.getItem('tokenCode');
    this.method='PUT';
    this.hiring_id=this.detailsHirings.id;

    if(this.status == "Calificado" || this.status == "Cancelado"){
      this.errorAlert('Ups! no es posible borrar de tu historial las solicitudes canceladas y/o calificadas');
      
    }

    else{
      this.loading.present();
        return  this.httpClient.post(this.url+"/api/hiring", {"status_id":5,"calification":this.qualificationValue, "_method":this.method,"hiring_id":this.hiring_id,"token":this.tokenCode,"comment":this.comment})
        .pipe(
        )
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.presentAlert('Solicitud eliminada');
          //window.location.reload()
          this.getHiringsActive();
          // this.navCtrl.setRoot(ActiveHiringsPage);
          this.navCtrl.setRoot(HiringsPage);

        },err => {
          this.loading.dismiss();
          this.errorAlert('No es posible cancelar una solicitud en estado Contratado ');
      }); //subscribe
    }
    
  }


  /****METODO PARA ACEPTAR LA CONTRATACION***/
  acceptHiring(){
     this.loading = this.loadingController.create({
        content: 'Por favor espere...'
      });
      this.loading.present();
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    this.tokenCode = localStorage.getItem('tokenCode');
    this.method='PUT';
    this.hiring_id=this.detailsHirings.id;
    return  this.httpClient.post(this.url+"/api/hiring", {"status_id":3, "_method":this.method,"hiring_id":this.hiring_id,"token":this.tokenCode})
      .pipe(
      )
      .subscribe((res:any)=> {
        this.loading.dismiss();
        this.presentAlert(res.msg);
        this.navCtrl.setRoot(HiringsPage);
        this.getHiringsActive();
       },err => {
        this.loading.dismiss();
        //this.errorAlert(err.error.errors);
        this.errorAlert('Ha ocurrido un error');
    }); //subscribe
  }


    changeHide(){
      this.hide=1;
    }

    qualify(){
       this.loading = this.loadingController.create({
        content: 'Por favor espere...'
      });
      this.loading.present();
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      this.tokenCode = localStorage.getItem('tokenCode');
      this.method='PUT';
      this.hiring_id=this.detailsHirings.id;
      return  this.httpClient.post(this.url+"/api/hiring", {"comment":this.comment,"bidder_id":this.bidder_id,"calification":this.qualifyValue,"status_id":4, "_method":this.method,"hiring_id":this.hiring_id,"token":this.tokenCode})
        .pipe(
        )
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.presentAlert(res.msg);
          /*this.navCtrl.push(ServicesPage)*/
          this.navCtrl.setRoot(HiringsPage);
         },err => {
          this.loading.dismiss();
          this.errorAlert('Ha ocurrido un error');
          this.navCtrl.push(HiringsPage)
      }); //subscribe
    }

    





}
