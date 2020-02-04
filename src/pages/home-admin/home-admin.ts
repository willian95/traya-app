import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HomeAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-admin',
  templateUrl: 'home-admin.html',
})
export class HomeAdminPage {
  userRol:any
  phrase:any

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeAdminPage');
    if(localStorage.getItem('user_rol') == '3'){
      this.userRol = "Administrador"
      this.phrase = "Aquí puedes gestionar los servicios y localidades del sistema"
    }else if(localStorage.getItem('user_rol') == '4'){
      this.userRol = "Admin. municipio"
      this.phrase = "Aquí puedes gestionar tu municipio en la app"
    }
  }

}
