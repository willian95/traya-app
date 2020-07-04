import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Platform,AlertController,ToastController,Events,ModalController, MenuController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { UsersServicesPage } from '../users-services/users-services';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { NotificationPage } from '../notification/notification';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';

import { Observable } from 'rxjs';


import { Subscription } from "rxjs/Subscription"

@IonicPage()
@Component({
  selector: 'page-services',
  templateUrl: 'services.html',
})
export class ServicesPage {
  url:any;

  constructor(public events: Events,public toastController: ToastController,private alertCtrl: AlertController,private plt: Platform,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider, public modalCtrl: ModalController, public menu: MenuController) {

    console.log("nav", this.navCtrl)

     this.storage = localStorage;
    this.loading = this.loadingController.create({
             content: 'Por favor espere...'
         });
         this.url=serviceUrl.getUrl();

         this.checkNotificationId()

    this.plt.ready().then((readySource) => {
    this.localNotifications.on("click", (notification, state) =>{
      
      this.checkNotificationId()
    })
  });

  }
  token:any;
  servicesArray:any;
  servicesSearch:any;
  words:any
  loading:any;
  usersLoading:any;
  searchText:any;
  user_id:any;
  notificationArray:any;
  storage:any;
  notificationNumber:any;
  userLocationId:any
  isListShowed:any = false

  checkNotificationId(){

    if(localStorage.getItem("notificationId") != null){

      this.loading = this.loadingController.create({
          content: 'Por favor espere...'
      });
      //this.loading.present()
      this.httpClient.get(this.url+"/api/hiring/"+localStorage.getItem("notificationId"))
      .pipe()
        .subscribe((res:any)=> {

          //this.loading.dismiss()

          if(res.bidder.id == this.user_id){

            

          }else{
            localStorage.removeItem("notificationId")
            this.navCtrl.push("HiringDetailsPage",{data:res});
            
          }
      });

      //this.loading.dismiss()


    }

  }


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

    this.user_id = localStorage.getItem('user_id');
    if(localStorage.getItem("notificationId") == null){
      this.getServices();
    }
    if (localStorage.getItem('valueServices') !=null) {
      if(localStorage.getItem('terms') == 'true'){
        this.toastTweet();
      }
     this.storage.removeItem('valueServices');
    }

    /***LLAMA LA FUNCION EN UN INTERVALO DE TIEMPO***/
    // Observable.interval(200000).subscribe(()=>{
    //    this.toastTweet();
    //  });
    this.userLocationId = window.localStorage.getItem("user_locality_id")


  }

  ionViewDidEnter(){
    this.storeAction()
    
    //if(this.)
    this.searchText = ""
    this.search()
    this.hideWordsList()

    //this.checkContactReview()
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

 doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
      this.getServicesRefresh();
    }, 2000);
  }


  presentNotifications(){
    this.navCtrl.push("NotificationPage"); // nav
  }


 getServicesRefresh() {
     var location_id = localStorage.getItem('user_locality_id');
    this.httpClient.get(this.url+"/api/services?"+'filters={"location_id":"'+location_id+'"}')
  .pipe()
    .subscribe((res:any)=> {
    this.servicesArray=res.data;
    this.servicesSearch = res.data

  });
  }

  getServices() {
  var location_id = localStorage.getItem('user_locality_id');
    this.loading.present();
  //this.httpClient.get(this.url+'/api/services')
    this.httpClient.get(this.url+"/api/services?"+'filters={"location_id":"'+location_id+'"}')
  .pipe()
    .subscribe((res:any)=> {
     this.loading.dismiss();
    this.servicesArray=res.data;
    this.servicesSearch = res.data

  });
  }

  nth_ocurrence(str, needle, nth) {
    for (let i=0;i<str.length;i++) {
      if (str.charAt(i) == needle) {
          if (!--nth) {
             return i;    
          }
      }
    }
    return -1;
  }

  onCancelSearch(){
    this.hideWordsList()
  }

  lookForSeachedWords(){
    let searches = ""
    this.isListShowed = true

    if(localStorage.getItem("searchedWords") != null)
    {
      searches = localStorage.getItem("searchedWords")
      this.words = searches.split(",")
      console.log(this.words.length)
      if(this.words.length > 3){
        this.words.splice(3, 1)
      }
    } 

  }

  hideWordsList(){
    this.words = null
    this.isListShowed = false
  }

  setSearchText(word){
    this.searchText = word
    this.search()
    this.words = null
  }

  deleteSearchedWord(word){

    let searches = ""
    if(localStorage.getItem("searchedWords") != null)
      searches = localStorage.getItem("searchedWords")

      
    let string = searches.replace(word+",", "")

    if(searches.split(",").length - 1 == 1){
      string = searches.replace(word, "")
    }

    localStorage.setItem("searchedWords", string)
    this.lookForSeachedWords()
  }

  viewUsers(items:any,i:any){

    if(this.searchText != ""){

      let searches = ""
      if(localStorage.getItem("searchedWords") != null)
        searches = localStorage.getItem("searchedWords")
      
      if(searches.indexOf(this.searchText) > -1){

      }else{

        searches = this.searchText +","+searches
        if(searches.split(",").length - 1 >= 4){

          let index = this.nth_ocurrence(searches, ",", 3)
          let string = searches.substring(0, index)
          localStorage.setItem("searchedWords", string)

        }else{
          localStorage.setItem("searchedWords", searches)
        }

      }

    }


    var location_id = localStorage.getItem('user_locality_id');
    //alert('hey')

    let usersLoading = this.loadingController.create({
      content: "Por favor espere"
    });

    usersLoading.present();

    this.httpClient.get(this.url+"/api/services_user?"+"services="+items.id+"&"+"location_id="+location_id)
    .pipe()
    .subscribe((res:any)=> {
      console.log("viewUsers")
      console.log(res)
      var servicesName = items.name;
      var services_id = items.id;
      localStorage.setItem('servicesName',servicesName);
      localStorage.setItem('services_id',services_id);
      this.navCtrl.push("UsersServicesPage",{data:res.data});
      usersLoading.dismiss();
  });
  }
  search(){

    //if(this.searchText.length > 0){
      this.lookForSeachedWords()
    

    if(this.searchText != ""){

      var text = this.searchText.toUpperCase();
      text = text.replace("Á", "A")
      text = text.replace("É", "E")
      text = text.replace("Í", "I")
      text = text.replace("Ó", "O")
      text = text.replace("Ú", "U")


      this.servicesSearch = []

      console.log("test-services-array", this.servicesArray)

      this.servicesArray.forEach((data, index) => {
       
        //console.log(data.name.includes(text))
        let searchString = data.name.toUpperCase()
        searchString = searchString.replace("Á", "A")
        searchString = searchString.replace("É", "E")
        searchString = searchString.replace("Í", "I")
        searchString = searchString.replace("Ó", "O")
        searchString = searchString.replace("Ú", "U")
        
        console.log("test-text-first", text)

        if(searchString.includes(text)){
          
          console.log("test-searchstring", searchString)
          console.log("test-text", text)

          this.servicesSearch.push(data)
        }

      })

      

    }else{
      this.servicesSearch = this.servicesArray;
    }

    /*this.httpClient.get(this.url+"/api/services?"+'filters={"name":"'+this.searchText+'"}')

    .pipe()
      .subscribe((res:any)=> {
      this.servicesArray=res.data;

    });*/
  }

  async toastTweet() {

    var notification = localStorage.getItem('location_description')
    
    if(notification != "null"){
      const toast = await this.toastController.create({
        message: notification,
        showCloseButton: true,
        closeButtonText: 'Cerrar',
        cssClass: 'your-toast-css-class'
      });
      toast.present();
    }
    
  }

  checkContactReview(){
    
    this.httpClient.post(this.url+'/api/contact-review/check', {user_id: localStorage.getItem("user_id")})
    .subscribe((res:any) => {

      //alert(res.askQuestion)
      //console.log("test-res", res)
      if(res.askQuestion == true){
        const contactReviewModal = this.modalCtrl.create("ModalContactReviewPage", {userReceiver: res.userReceiver, contactReview: res.contactReview, service: res.service});
        contactReviewModal.present();
        contactReviewModal.onDidDismiss(() => {
          if(localStorage.getItem("contactReviewId") != null){
            this.httpClient.get(this.url+"/api/hiring/"+localStorage.getItem("contactReviewId"))
            .pipe()
              .subscribe((res:any)=> {
                localStorage.removeItem("contactReviewId")
                this.navCtrl.push("HiringDetailsPage",{data:res});
            });
          }
          

        });
        this.menu.swipeEnable(false);
      }

    })

  }


}
