import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SuperTabs } from 'ionic2-super-tabs';
import { Events } from 'ionic-angular';

/**
 * Generated class for the FavoriteTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorite-tabs',
  templateUrl: 'favorite-tabs.html',
})
export class FavoriteTabsPage {

  @ViewChild(SuperTabs) superTabs: SuperTabs;
  page1: any = "FavoritePage";
  page2: any = "HiringsPage";
  hiringCount:any
  token:any
  user_id:any
  url:any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, private serviceUrl:ServiceUrlProvider, public httpClient: HttpClient, private alertCtrl: AlertController) {
    this.hiringCount = 0;
    this.url=serviceUrl.getUrl();

    this.countActiveHirings()
    this.token = window.localStorage.getItem("tokenCode")

    this.events.subscribe('countHirings', (data) =>{
      this.countActiveHirings()
    });

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoriteTabsPage');
  }

  presentNotifications(){
    this.navCtrl.push("NotificationPage"); // nav
  }

  showConfirm() {
    console.log("hey")
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
    }
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

}
