import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  receiverName:any
  receiverImage:any
  receiverId:any
  text:any=""
  senderId:any
  url:any
  lastMessage:any = null
  messages:any = []
  hasMoreMessages:any = false
  from;any

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, private serviceUrl:ServiceUrlProvider, private socket:Socket, public alertCtrl: AlertController) {
    this.receiverName = navParams.get('username');
    this.from = navParams.get("from")
    this.url = this.serviceUrl.getUrl() 
    this.receiverImage = navParams.get('userimage');
    this.receiverId = navParams.get("bidder_id")
    this.senderId = window.localStorage.getItem("user_id")

    this.listener().subscribe(message => {
      
      this.messages.push(message)
      window.setTimeout(() => {
        var objDiv = document.getElementById("chat-container");
        objDiv.scrollTop = objDiv.scrollHeight+300;
      }, 200)
    })

  }

  listener(){

    let sender = this.senderId
    let receiver = this.receiverId
    let prefix = ""

    if(receiver < sender)
      prefix = receiver+"-"+sender
    else
      prefix = sender+"-"+receiver

    //console.log("message-"+prefix)

    let observable = new Observable(observer => {
      this.socket.on('message-'+prefix, data => {
      
        observer.next(data)
      
      })
    })

    return observable

  }

  ionViewDidEnter(){
    this.fetchMessages()
  }

  fetchMessages(){

    this.httpClient.post(this.url+"/api/message/fetch/chat", {senderId: this.senderId, receiverId:this.receiverId, lastMessage: this.lastMessage})
      .subscribe((res:any)=> {
        console.log("messages", res);
        if(res.success == true){

          this.hasMoreMessages = res.hasMoreMessages

          this.lastMessage = res.lastMessage
          if(this.messages.length <= 0){

            res.messages.forEach((data) => {

              this.messages.push({"message": data.message.message, "time": data.time, "sender_id":data.message.sender_id, "receiver_id":data.message.receiver_id, "id": data.message.id});

            })

    

            window.setTimeout(() => {
              var objDiv = document.getElementById("chat-container");
              objDiv.scrollTop = objDiv.scrollHeight+300;
            }, 200)

          }else{
           
            res.messages.forEach((data) => {

              this.messages.unshift({"message": data.message.message, "time": data.time, "sender_id":data.message.sender_id, "receiver_id":data.message.receiver_id, "id": data.message.id});

            })
        
          }


        }

    })

  }

  send(){

    if(this.text != ""){

      this.httpClient.post(this.url+"/api/message/store", {senderId: this.senderId, receiverId:this.receiverId, message: this.text})
      .subscribe((res:any)=> {
        
        this.socket.emit('add-message', {"message": this.text, "sender_id":this.senderId, "receiver_id": this.receiverId, "time": res.messageTime})
        this.text = ""

      })

      
    }

  }

  /*showConfirm(message) {
    const confirm = this.alertCtrl.create({
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }*/

  deleteMessage(id){
    
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

}
