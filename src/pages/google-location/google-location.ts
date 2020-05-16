import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicPage, NavController, NavParams, ToastController, AlertController} from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { ProfilePage } from '../profile/profile';
/*import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';*/

interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}

/**
 * Generated class for the GoogleLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google

@IonicPage()
@Component({
  selector: 'page-google-location',
  templateUrl: 'google-location.html',
})
export class GoogleLocationPage {

  map = null
  //directionsService = new google.maps.DirectionsService();
  //directionsDisplay = new google.maps.DirectionsRenderer();
  
  detailsHiring:any
  url:any
  myaddress:any
  location:any
  actualLocation:any
  hiring_id:any
  user_id:any
  rol_id:any

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, private serviceUrl:ServiceUrlProvider, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder, public toastController: ToastController, private alertCtrl: AlertController) {
    
    this.detailsHiring = navParams.get('data');
    console.log(this.detailsHiring)
    console.log(this.detailsHiring)
    this.url=serviceUrl.getUrl();
    this.myaddress = localStorage.getItem("user_domicile")
    this.location = localStorage.getItem("user_locality_name")
    this.user_id = localStorage.getItem('user_id')
    this.rol_id = localStorage.getItem('user_rol')

  }

  ionViewDidLoad() {
    window.setTimeout(() => {
      this.loadMap()
    }, 2000)
  }

  ionViewDidEnter(){
    this.storeAction()
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


  loadMap(){

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    };

    this.nativeGeocoder.forwardGeocode(this.location+", "+this.myaddress, options)
    .then((coordinates: NativeGeocoderForwardResult[]) => {
        //console.log('The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude)

          var mapEle = document.getElementById('myLocation') as HTMLElement;
          
          // create LatLng object
          const myLatLng = {lat: parseFloat(coordinates[0].latitude), lng: parseFloat(coordinates[0].longitude)};
          //const myLatLng = {lat: 11.7064801, lng: -70.2196518};
          // create map
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

      })
      .catch((error: any) => console.log("geocoder error", error));

  }

  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title
    });
  }

  async messageToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

  changeMyAddress(){

    let tokenCode = localStorage.getItem('tokenCode');

    this.httpClient.post(this.url+"/api/changeAddress", {"address":this.myaddress, "token": tokenCode})
      .pipe()
      .subscribe((res:any)=> {    

        if(res.success == true){
          localStorage.setItem("user_domicile", this.myaddress)
          this.loadMap()
        }

        this.messageToast(res.msg);

      })
  }

  locationPrompt(){
    const prompt = this.alertCtrl.create({
      title: 'Ubicación',
      inputs: [
        {
          name: 'title',
          placeholder: 'Escriba aquí la dirección',
          value: this.myaddress,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            
            if (data.title !='') {
              this.myaddress = data.title;
              this.changeMyAddress()
            } else {
              console.log("falso");
              return false;
            }
          }
        }
      ]
    });
    prompt.present();
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

  updateShowMap(){

    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let tokenCode = localStorage.getItem('tokenCode');
    let method='POST';

    this.hiring_id=this.detailsHiring.id;
    //this.geolocation.getCurrentPosition().then((resp) => {
      //alert(resp.coords.latitude+" "+resp.coords.longitude)

      return  this.httpClient.post(this.url+"/api/hiring/update/map/"+this.hiring_id, {"rol_id": this.rol_id, "user_id": this.user_id, "_method":method, "token":tokenCode})
      .pipe()
      .subscribe((res:any)=> {
        
        this.presentAlert(res.msg)
        this.navCtrl.pop();
        //this.navCtrl.push("HiringsPage");

      },err => {
       
    //});
      // 
     /*}).catch((error) => {
       console.log('Error getting location', error);
     });*/


  })

}



}
