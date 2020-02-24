import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  // parque simon bolivar
  origin = { lat: 4.658383846282959, lng: -74.09394073486328 };
  // Parque la 93
  destination = { lat: 4.676802158355713, lng: -74.04825592041016 };
  hiringDetails:any
  url:any

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, private serviceUrl:ServiceUrlProvider, private geolocation: Geolocation) {
    this.hiringDetails = navParams.get('data');
    this.url=serviceUrl.getUrl();
  }

  ionViewDidLoad() {
    this.loadMap()
  }


  loadMap(){

    let rol_id = localStorage.getItem('user_rol')

    if(rol_id == "1"){
      console.log(this.hiringDetails.bidder)
    }else if(rol_id == "2"){
      console.log(this.hiringDetails.applicant)

      let headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );
      let tokenCode = localStorage.getItem('tokenCode');

      this.httpClient.post(this.url+"/api/hiring/get/position", {"userId": this.hiringDetails.applicant.id, "token": tokenCode} )
      .pipe()
      .subscribe((res:any)=> {

        this.geolocation.getCurrentPosition().then((resp) => {
          //alert(resp.coords.latitude+" "+resp.coords.longitude)

          const mapEle: HTMLElement = document.getElementById('map');
          // create LatLng object
          const myLatLng = {lat: resp.coords.latitude, lng: resp.coords.longitude};
          // create map
          this.map = new google.maps.Map(mapEle, {
            center: myLatLng,
            zoom: 10
          });

          //this.directionsDisplay.setMap(this.map);

          google.maps.event.addListenerOnce(this.map, 'idle', () => {
            //this.renderMarkers();
            mapEle.classList.add('show-map');
            const marker1 = {
              position:{
                lat: resp.coords.latitude,
                lng: resp.coords.longitude
              },
              title:"punto uno"
            }
            //console.log(res.latitude)
            const marker2 = {
              position:{
                lat: parseFloat(res.latitude),
                lng: parseFloat(res.longitude)
              },
              title:"punto dos"
            }

            this.addMarker(marker1)
            this.addMarker(marker2)
            //this.calculateRoute()

          });

        
          // 
         }).catch((error) => {
           console.log('Error getting location', error);
         });


      },err => {
        
      });

    }


  }

  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title
    });
  }

  /*private calculateRoute() {
    this.directionsService.route({
      origin: this.origin,
      destination: this.destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status)  => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }*/

}
