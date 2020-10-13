import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController  } from 'ionic-angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';

/**
 * Generated class for the ChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {

  url:any
  userId:any
  userRol:any
  chats:any = []

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, private serviceUrl:ServiceUrlProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.url = this.serviceUrl.getUrl()
    this.userId = window.localStorage.getItem("user_id")
    this.userRol = window.localStorage.getItem("user_rol")
  }

  ionViewDidEnter(){
    this.fetchChats()
  }

  openChat(username, userimage, bidder_id){
    this.navCtrl.push("ChatPage", {username: username,userimage:userimage, bidder_id: bidder_id})
  }

  

  fetchChats(){

    this.httpClient.post(this.url+"/api/my-chats", {userId: this.userId})
    .subscribe((res:any)=> {

      if(res.success == true){

        this.chats = res.users

      }

    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatsPage');
  }

  deleteSpecific(receiver_id){

    var loader = this.loadingCtrl.create({});
    loader.present();

    this.httpClient.post(this.url+"/api/message/conversation/delete", {user_id: this.userId, receiver_id: receiver_id, type: "one"})
    .subscribe((res:any)=> {
      loader.dismiss()
      if(res.success == true){
        
        this.fetchChats()

      }

    })

  }

  deleteAll(){

    var loader = this.loadingCtrl.create({});
    loader.present();

    this.httpClient.post(this.url+"/api/message/conversation/delete", {user_id: this.userId, type: "all"})
    .subscribe((res:any)=> {
      loader.dismiss()
      if(res.success == true){
        
        this.fetchChats()

      }

    })

  }

  showConfirm(message, type, receiver_id = 0) {
  
    const confirm = this.alertCtrl.create({
      message: message,
      buttons: [
        {
          text: 'No',
          handler: () => {
            
          }
        },
        {
          text: 'Sí',
          handler: () => {
            if(type == "one"){
              this.deleteSpecific(receiver_id)
            }else if(type == "all"){
              this.deleteAll()
            }
          }
        }
      ]
    });
    confirm.present();
  }

  goToServices(){
    if(this.userRol == 1){
      this.navCtrl.setRoot("TrayaPage")
    }else if(this.userRol == 2){
      this.navCtrl.setRoot("TrayaBidderPage")
    }
    
  }



}
