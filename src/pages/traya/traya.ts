import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,AlertController,ToastController,ModalController,MenuController, LoadingController} from 'ionic-angular';
import { Events } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';
import { StatusBar } from '@ionic-native/status-bar';

@IonicPage()
@Component({
  selector: 'page-traya',
  templateUrl: 'traya.html',
})
export class TrayaPage {
  @ViewChild(SuperTabs) superTabs: SuperTabs;

    page1: any = "ServicesPage";
    page2: any = "HiringsPage";
    username:any;
    user_id:any;
    token:any;
    url:any;
    notificationArray:any;
    notificationNumber:any;
    config:any;
    loading:any;
    hiringCount:any
  constructor(private statusBar: StatusBar, public loadingController: LoadingController, private menu: MenuController,public modalCtrl: ModalController,public events: Events,public toastController: ToastController,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,private alertCtrl: AlertController,private plt: Platform,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,private serviceUrl:ServiceUrlProvider) {
    this.hiringCount = 0;
    this.url=serviceUrl.getUrl();
      
    this.events.subscribe('countHirings', (data) =>{
      this.countActiveHirings()
    });

    this.plt.ready().then((readySource) => {
      this.localNotifications.on('click', (notification, state) => {
       
        this.loading = this.loadingController.create({
            content: 'Por favor espere...'
        });
        console.log("traya-notification changeUser")
        //this.loading.present()

        if(localStorage.getItem("notificationId") != "undefined"){
          this.httpClient.get(this.url+"/api/hiring/"+localStorage.getItem("notificationId"))
          .pipe()
            .subscribe((res:any)=> {
              //this.loading.dismiss()
              if(res.bidder.id == this.user_id){
    
                alert("Debes dirigirte al modo trabajador")
    
              }
          });
        }else{
          localStorage.removeItem("notificationId")
        }

        
        
  
      })
    });

  this.statusBar.backgroundColorByHexString('#7f0093');

  }

     scheduleNotification(message,hiring_id) {
  this.localNotifications.schedule({
    id: 1,
    title: 'Atención',
    text: message,
    data: { mydata: hiring_id},
    sound: null
  });
}

checkChatId(){

  if(localStorage.getItem("chatId") != null){
    
    let chatId = localStorage.getItem("chatId")
    localStorage.removeItem("chatId")

    this.httpClient.get(this.url+"/api/user/"+chatId)
    .subscribe((res:any) => {

      console.log("chat-res",res)
      this.navCtrl.push("ChatPage", {username: res.user.name,userimage:res.image, bidder_id: res.user.id})

    })

    //this.navCtrl.push("ChatPage", {username: username,userimage:userimage, bidder_id: bidder_id})
    //this.navCtrl.push("HiringDetailsPage",{data:res});
  
  }

}

  ionViewDidEnter(){
    this.checkChatId()
    this.storeAction()
    this.checkContactReview()
  }

  ionViewDidLoad() {
    
    //window.setInterval(() => {
      this.countActiveHirings()
    //}, 5000) 
  
    const channel = this.pusherNotify.init();
    let self = this;
    channel.bind('notificationUser', function(data) {
      self.scheduleNotification(data.message,data.hiring.id);
      self.events.publish('notifiticarionHiring',data.hiring);
      var hiring_id = data.hiring.id;
      localStorage.setItem('hiring_id',hiring_id);
    });

    this.user_id = localStorage.getItem('user_id');
    this.getMode();

  }
  slideToIndex(index: number) {
   this.superTabs.slideTo(index);
 }
 presentNotifications(){
   this.navCtrl.push("NotificationPage"); // nav
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

 hideToolbar() {
   this.superTabs.showToolbar(false);
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

 changeUserType(){

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

 getMode(){
   if(localStorage.getItem('token') != null){
     var headers = new HttpHeaders({
       Authorization: localStorage.getItem('token'),
     });
     this.httpClient.get(this.url+'/api/config', { headers })
     .subscribe((response:any)=> {
       this.config=response.data;
       if(this.config.active != 0){
         const maintenanceModal = this.modalCtrl.create("MaintenancePage");
         maintenanceModal.present();
         this.menu.swipeEnable(false);
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

checkContactReview(){

  var headers = new HttpHeaders({
    Authorization: localStorage.getItem('token'),
  });
  this.httpClient.post(this.url+'/api/contact-review/check', { headers })
  .subscribe((res:any) => {

    console.log("test-check-contact-review", res)

  })

}

showConfirm() {
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



}
