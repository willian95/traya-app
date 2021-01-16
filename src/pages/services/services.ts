import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Platform,AlertController,ToastController,Events,ModalController, MenuController,App } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { UsersServicesPage } from '../users-services/users-services';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { NotificationPage } from '../notification/notification';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PusherProvider } from '../../providers/pusher/pusher';
import { InAppBrowser } from '@ionic-native/in-app-browser';

var interval = null

@IonicPage()
@Component({
  selector: 'page-services',
  templateUrl: 'services.html',
})


export class ServicesPage {
  url:any;

  constructor(public events: Events,public toastController: ToastController,private alertCtrl: AlertController,private plt: Platform,private pusherNotify: PusherProvider,private localNotifications: LocalNotifications,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider, public modalCtrl: ModalController, public menu: MenuController, public appCtrl: App, private iab: InAppBrowser) {

    this.token = window.localStorage.getItem("tokenCode")

    if(this.token == null){
      localStorage.setItem("noAuth", "true")
    }
    

     this.storage = localStorage;
    this.loading = this.loadingController.create({
             content: 'Por favor espere...'
         });
         this.url=serviceUrl.getUrl();
         if(!this.token){
          this.fetchLocaltions()
         }
         

    this.plt.ready().then((readySource) => {
    this.localNotifications.on("click", (notification, state) =>{
      
      //this.checkNotificationId()
    })

    this.events.subscribe('userLocationChanged',(res)=>{
      this.getServicesNoAuth()
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
  locations:any
  location:any = 11
  isListShowed:any = false

  checkNotificationId(){
    
    if(localStorage.getItem("notificationId") != null){

      /*this.loading = this.loadingController.create({
          content: 'Por favor espere...'
      });*/
      //this.loading.present()
      
      window.clearInterval(interval)
      this.httpClient.get(this.url+"/api/hiring/"+localStorage.getItem("notificationId"))
      .pipe()
        .subscribe((res:any)=> {

          //this.loading.dismiss()
          /*if(res.bidder.id == this.user_id){

          }else{*/
            localStorage.removeItem("notificationId")
            this.navCtrl.push("HiringDetailsPage",{data:res});
            //interval = window.setInterval(() => {this.checkNotificationId()}, 1000)
          //}
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

  openInstagram(){
    this.iab.create('https://www.instagram.com/traya.argentina', '_system');
    //window.open("https://www.instagram.com/traya.argentina", "_system", "location=yes")
  }

  openFacebook(){
    this.iab.create('https://www.facebook.com/TrayaArgentina', '_system');
    //window.open("https://www.facebook.com/TrayaArgentina", "_system", "location=yes")
  }

  ionViewDidLoad() {
 
   const channel = this.pusherNotify.init();
    let self = this;
    channel.bind('notificationUser', function(data) {
      self.scheduleNotification(data.message,data.hiring.id);
    });

    
    interval = window.setInterval(() => {this.checkNotificationId()}, 1000)


    this.user_id = localStorage.getItem('user_id');
   
    if(localStorage.getItem('token') != null){
        if(localStorage.getItem("services_array")){
          this.servicesArray = JSON.parse(localStorage.getItem("services_array"))
        }else{
          this.getServices();
        }
    }else{
      if(localStorage.getItem("services_array")){
        this.servicesArray = JSON.parse(localStorage.getItem("services_array"))
      }else{
        this.getServicesNoAuth();
      }
    }

    
    /*if (localStorage.getItem('valueServices') !=null) {
      if(localStorage.getItem('terms') == 'true'){
        this.toastTweet();
      }
     this.storage.removeItem('valueServices');
    }*/

    /***LLAMA LA FUNCION EN UN INTERVALO DE TIEMPO***/
    // Observable.interval(200000).subscribe(()=>{
    //    this.toastTweet();
    //  });
    this.userLocationId = window.localStorage.getItem("user_locality_id")


  }

  ionViewDidEnter(){
    this.storeAction()
    
 
    this.searchText = ""
    this.search()
    this.hideWordsList()
    console.log(localStorage.getItem("noAuth"), localStorage.getItem('token'))
    this.user_id = localStorage.getItem('user_id');
    if(localStorage.getItem('token') != null){
      if(localStorage.getItem("services_array") && localStorage.getItem("noAuth") == null){
        this.servicesArray = JSON.parse(localStorage.getItem("services_array"))
      }else{
        localStorage.removeItem("noAuth")
        this.getServicesRefresh();
      }
  }
    /*if(localStorage.getItem("notificationId") == null){
      this.getServices();
    }*/

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
    localStorage.removeItem("services_array")
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

      localStorage.setItem("services_array", JSON.stringify(this.servicesArray))
      

    });
  }

  getServicesNoAuth() {
    
      this.loading.present();
      this.location = window.localStorage.getItem("user_locality_id");
      console.log("noAuthLocation", location)

      this.httpClient.get(this.url+"/api/services?"+'filters={"location_id":'+this.location+'}')
    .pipe()
      .subscribe((res:any)=> {
      this.loading.dismiss();
      this.servicesArray=res.data;
      this.servicesSearch = res.data

      localStorage.setItem("services_array", JSON.stringify(this.servicesArray))
      

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

  fetchLocaltions(){

    
    this.httpClient.get(this.url+"/api/locations")
    .subscribe((response:any) => {
      this.locations = response.data
  
      let options = []
      this.locations.forEach((data)=>{
  
        options.push({"type": "radio", "label": data.name, "value": data.id})
  
      })
  
      let alert = this.alertCtrl.create({
        title: 'Selecciona una localidad',
        inputs: options,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'OK',
            handler: (data) => {
              
             if(data){
              
              this.location = data
              var locationChangeName = ""
              this.locations.forEach((data) =>{

                if(this.location == data.id)
                  locationChangeName = data.name

              })

              //console.log("locality_name", locationChangeName)
              localStorage.setItem("user_locality_name", locationChangeName)
              localStorage.setItem("user_locality_id", this.location)

              this.events.publish("userLocationChanged")

              this.getServicesNoAuth()
             }
              // I NEED TO GET THE VALUE OF THE SELECTED RADIO BUTTON HERE
            }
          }
        ]
      });
      alert.present();
    })
  
  }

  viewUsers(items:any,i:any){

    console.log("token", this.token)
   
    if(this.token){
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
    }else{
      const confirm = this.alertCtrl.create({
        title: 'Bienvenid@ a Traya',
        message: 'Para acceder a los trabajadores debes Iniciar Sesión con un usuario registrado, si aún no creaste tu usuario por favor regístrate',
        buttons: [
          {
            text: 'Iniciar Sesión',
            handler: () => {
              this.appCtrl.getRootNav().push("LoginPage");
            }
          },
          {
            text: 'Registrarse',
            handler: () => {
              this.appCtrl.getRootNav().push("RegisterPage");
            }
          }
        ]
      });
      confirm.present();
    }
  

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

    let rol_id = localStorage.getItem("user_rol")
    
    if(rol_id != "3"){
      var notification = localStorage.getItem('location_description')
      //console.log("test-rolId", rol_id, notification)
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
