import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ActionSheetController,Events,Platform,ToastController,ModalController, App, ViewController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from 'ionic-angular';
import { HiringsPage } from '../hirings/hirings';
import { CallNumber } from '@ionic-native/call-number';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { NotificationPage } from '../notification/notification';
import { ProfilePage } from '../profile/profile';
import { ActiveHiringsPage } from '../active-hirings/active-hirings';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';
//import { ModalInformationPage } from '../modal-information/modal-information';
import { ServicesPage } from '../services/services';
import { SuperTabsController } from 'ionic2-super-tabs';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleLocationPage } from '../google-location/google-location'
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';

interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}

declare var google

@IonicPage()
@Component({
  selector: 'page-hiring-details',
  templateUrl: 'hiring-details.html',
})
export class HiringDetailsPage {
  url:any;
  qualifyValue:any;
  showMap:any
  showMapApplicant:any
  showMapBidder:any
  applicantAddress:any
  bidderAddress:any
  location:any
  from:any = null
  
  constructor(private superTabsCtrl: SuperTabsController,public modalCtrl: ModalController,public toastController: ToastController,public events: Events,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private alertCtrl: AlertController,public actionSheetController: ActionSheetController,public callNumber: CallNumber,private serviceUrl:ServiceUrlProvider,private pusherNotify: PusherProvider,private plt: Platform,private localNotifications: LocalNotifications, private geolocation: Geolocation, public viewCtrl: ViewController, public appCtrl: App, private launchNavigator: LaunchNavigator, private nativeGeocoder: NativeGeocoder) {
    this.detailsHirings = navParams.get('data');
    this.from = navParams.get("from")



    console.log("test-details", this.detailsHirings)
    this.showMap = false
    this.opinionCount = 0
    //console.log("applicant", this.detailsHirings.applicant.address)
    //console.log("bidder", this.detailsHirings.bidder.address)
    this.applicantAddress = this.detailsHirings.applicant.address
    this.bidderAddress = this.detailsHirings.bidder.address

    this.location = localStorage.getItem('user_locality_name')

    let histories = this.detailsHirings.history
    
    for(let i = 0; i < histories.length; i++){

      if(histories[i].status_id == 3){
        this.showMap = true
      }

      if(histories[i].status_id == 4){
        this.showMap = false
      }

      if(histories[i].status_id == 5){
        this.showMap = false
      }
    }

    this.loading = this.loadingController.create({
             content: 'Por favor espere hirings details...'
         });
    this.url=serviceUrl.getUrl();
    
         events.subscribe('star-rating:changed',
         (starRating) =>  {
           this.qualifyValue = starRating;
         });

           // LOCALNOTIFACTION
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
  map:any
  favoriteCheck:any = false


   scheduleNotification(message,hiring_id) {
  this.localNotifications.schedule({
    id: 1,
    title: 'Atención',
    text: message,
    data: { mydata: hiring_id },
    sound: null
  });
}

  checkFavorite(){

    this.httpClient.post(this.url+"/api/favorite/check", {auth_id: this.user_id, user_id: this.bidder_id})
    .pipe()
    .subscribe((res:any)=> {
      
      if(res.success == true){
        this.favoriteCheck = res.favoriteCheck
      }

    });

  }

  openChat(username, userimage, bidder_id, from){
    this.navCtrl.push("ChatPage", {username: username,userimage:userimage, bidder_id: bidder_id, from: from})
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
    
    this.showApplicant();
    this.showBidder();
    this.getNotifications();

    if (this.detailsHirings.status_id == 2 && this.rol_id ==1) {
        if(localStorage.getItem('bidder_on') == null){
        localStorage.setItem('bidder_on','false');
        const infoModal = this.modalCtrl.create("ModalInformationPage");
        infoModal.present();
      }else if(localStorage.getItem('bidder_on') == 'false'){
         const infoModal = this.modalCtrl.create("ModalInformationPage");
        infoModal.present();
      }
    }

    //if(this.showMapBidder == 1){
      //this.getMaps()
    

  }

  ionViewDidEnter(){
    this.storeAction()
    this.getMaps()
    this.checkFavorite()
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

    deleteFromHistory(){

      this.httpClient.post(this.url+"/api/hiring-history/delete", {"hiring_id": this.detailsHirings.id}).subscribe((res:any) => {

        if(res.success == true){
          this.navCtrl.pop()
        }

      })

    }

    confirmAlertOk() {
      let alert = this.alertCtrl.create({
        title: ' <img src="assets/imgs/info.png" class="logo2" />',
        message: '¿Desea borrar la solicitud del historial?',
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'Si',
            role: 'cancel',
            handler: () => {
              this.deleteFromHistory();
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
        cssClass:"customRows"
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
      window.open("whatsapp://send?text=¡Hola! te contacto desde Traya App de Servicios...&phone="+this.bidderPhone,"_system","location=yes");
      

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
      window.open("whatsapp://send?text=¡Hola! te contacto desde Traya App de Servicios...!&phone="+this.applicantPhone,"_system","location=yes");
      /*https://api.whatsapp.com/send?phone="+this.applicantPhone.substr(1)+"&text=&source=&data=";*/

    }

    showCompleteDescription(){
      
      //if(this.hiringDescription.length >= 70){
        const alert = this.alertCtrl.create({
          subTitle: this.hiringDescription,
          buttons: ['OK']
        });
        alert.present();
      //}
      
    }

    /****METODO PARA CREAR LA CONTRATACION***/
    createHiring(){
      //this.loading.present();
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      this.tokenCode = localStorage.getItem('tokenCode');
      this.method='PUT';
      this.hiring_id=this.detailsHirings.id;
      return  this.httpClient.post(this.url+"/api/hiring", {"status_id":2, "_method":this.method,"hiring_id":this.hiring_id,"token":this.tokenCode})
        .pipe()
        .subscribe((res:any)=> {
          window.localStorage.removeItem("active_hirings_worker")
          //this.loading.dismiss();
          this.presentAlert(res.msg);
          this.navCtrl.setRoot("ActiveHiringsPage");
          this.getHiringsActive();
         },err => {
          //this.loading.dismiss();
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
          this.events.publish("countHirings", "count")
          if(this.rol_id == 2){
            this.navCtrl.setRoot("ActiveHiringsPage");
          }else{
            this.navCtrl.setRoot("HiringsPage");
          }
          

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
      .pipe()
      .subscribe((res:any)=> {
        this.loading.dismiss();
        this.presentAlert(res.msg);
        window.localStorage.removeItem("traya_hirings")
        this.navCtrl.setRoot("HiringsPage");
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
          window.localStorage.removeItem("traya_hirings")
          this.presentAlert(res.msg);
          this.events.publish("countHirings", "count")
          /*this.navCtrl.push(ServicesPage)*/
          this.navCtrl.setRoot("HiringsPage");
         },err => {
          this.loading.dismiss();
          this.errorAlert('Ha ocurrido un error');
          this.navCtrl.push("HiringsPage")
      }); //subscribe
    }

    navigateTo(address){

      this.launchNavigator.navigate(address)

    }

    getMaps(){

      let headers = new HttpHeaders({
        Authorization: localStorage.getItem('token'),
      });

      this.hiring_id=this.detailsHirings.id;

      return  this.httpClient.get(this.url+"/api/hiring/get/map/"+this.hiring_id, {headers})
        .pipe()
        .subscribe((res:any)=> {

          console.log("showmap", res)

          this.showMapBidder = res.show_bidder_map
          this.showMapApplicant = res.show_applicant_map

          window.setTimeout(() => {
            this.loadMap()
          }, 2000) 

        },err => {
         
      });

    }

    createDescription() {
    
      let alert = this.alertCtrl.create({
        title: 'Comentario',
        inputs: [
        {
          name: 'comments',
          value: this.comment,
          placeholder: 'Dejá un comentario acerca del trabajo realizado, ¿Te gustó?'
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
              this.comment = data.comments;
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

    loadMap(){

      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 1
      };

      let address = ""

      if(this.rol_id == 1){
        address = this.bidderAddress
      }
      else{
        address = this.applicantAddress
      }

      this.nativeGeocoder.forwardGeocode(localStorage.getItem('user_locality_name')+", "+address, options)
      .then((coordinates: NativeGeocoderForwardResult[]) => {
        //console.log('The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude)

        if(this.showMap == true){
          if(this.rol_id == 1){
            var mapEle = document.getElementById('map1') as HTMLElement;
            console.log("showMapBidder",this.showMapBidder)
            console.log("mapEle",mapEle)
          } 
          else{
            var mapEle = document.getElementById('map2') as HTMLElement;
          }
        }
        

        

          // create LatLng object
          const myLatLng = {lat: parseFloat(coordinates[0].latitude), lng: parseFloat(coordinates[0].longitude)};
          //const myLatLng = {lat: 11.7064801, lng: -70.2196518}

          // create map
          if(this.showMap == true){
            this.map = new google.maps.Map(mapEle, {
              center: myLatLng,
              zoom: 15
            });
          
          //this.directionsDisplay.setMap(this.map);

          google.maps.event.addListenerOnce(this.map, 'idle', () => {
            //this.renderMarkers();
            //mapEle.classList.add('show-map');
            const marker1 = {
              position:{
                lat: parseFloat(coordinates[0].latitude),
                lng: parseFloat(coordinates[0].longitude)
                //lat: 11.7064801,
                //lng: -70.2196518
              },
              title:"punto uno"
            }
            //console.log(res.latitude

            this.addMarker(marker1)

          })

          }

      })
      //.catch((error: any) => console.log("geocoder error", error));
        
    }

    addMarker(marker: Marker) {
      console.log("marker", marker)
      console.log("map", this.map)
      return new google.maps.Marker({
        position: marker.position,
        map: this.map,
        title: marker.title
      });
    }

    goToGoogleLocation(){

      this.navCtrl.push("GoogleLocationPage", {data:this.detailsHirings});

    }

    storeFavorite(){

      this.httpClient.post(this.url+"/api/favorite/store", {"auth_id": this.user_id, "user_id": this.detailsHirings.bidder.id})
      .pipe()
      .subscribe((res:any)=> {
        
        this.presentAlert(res.msg)
        this.checkFavorite()

      })

    }

    deleteFavorite(){

      this.httpClient.post(this.url+"/api/favorite/delete", {"auth_id": this.user_id, "user_id": this.detailsHirings.bidder.id})
      .pipe()
      .subscribe((res:any)=> {
        
        this.presentAlert(res.msg)
        this.checkFavorite()

      })

    }

    updateShowMap(){

      let headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      let tokenCode = localStorage.getItem('tokenCode');
      let method='POST';


      //this.geolocation.getCurrentPosition().then((resp) => {
        //alert(resp.coords.latitude+" "+resp.coords.longitude)

        return  this.httpClient.post(this.url+"/api/hiring/update/map/"+this.hiring_id, {"rol_id": this.rol_id, "user_id": this.user_id, "_method":method, "token":tokenCode})
        .pipe()
        .subscribe((res:any)=> {
          
          this.presentAlert(res.msg)

        },err => {
         
      //});
        // 
       /*}).catch((error) => {
         console.log('Error getting location', error);
       });*/


    })

  }

    /*showGoogleMap(){

      this.viewCtrl.dismiss();
      this.appCtrl.getRootNav().push(GoogleLocationPage, {data: this.detailsHirings});

    }*/

}
