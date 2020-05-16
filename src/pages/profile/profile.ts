    import { Component } from '@angular/core';
    import { IonicPage, NavController, NavParams,LoadingController,Platform,ToastController,Events } from 'ionic-angular';

    import { AlertController } from 'ionic-angular';
    import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
    import { ServiceUrlProvider } from '../../providers/service-url/service-url';
    import { PusherProvider } from '../../providers/pusher/pusher';
    import { NotificationPage } from '../notification/notification';
    import { TrayaPage } from '../traya/traya';
    import { LoginPage } from '../login/login';
    import { ServicesJobPage } from '../services-job/services-job';
    import { TrayaBidderPage } from '../traya-bidder/traya-bidder';
    import { LocalNotifications } from '@ionic-native/local-notifications';



    @IonicPage()
    @Component({
      selector: 'page-profile',
      templateUrl: 'profile.html',
    })
    export class ProfilePage {
      url:any;
      pusher2:any;
      registerComplete:any
      constructor(public events: Events,public toastController: ToastController,public navCtrl: NavController, public navParams: NavParams,public loadingController: LoadingController,public httpClient: HttpClient,private alertCtrl: AlertController,private serviceUrl:ServiceUrlProvider, private pusherNotify: PusherProvider,private plt: Platform,private localNotifications: LocalNotifications) {
        this.loading = this.loadingController.create({
                 content: 'Por favor espere...'
             });
             this.url=serviceUrl.getUrl();
             // this.pusher2=pusherNotify.init();

             // LOCALNOTIFACTION
             this.registerComplete = localStorage.getItem("is_register_completed")
             //console.log("test-register-complete", this.registerComplete)
      this.plt.ready().then((readySource) => {
        var me = this;
        this.localNotifications.on('click', function(notification){
          let json = JSON.parse(notification.data);

          let alert = alertCtrl.create({
            title: notification.title,
            subTitle: json.mydata
          });
          alert.present();
           })
     });
      }
      name:any;
      email:any;
      services_id:any;
      phone:any;
      description:any;
      descriptionCount:any;
      user_id:any;
      token:any;
      tokenCode:any;
      loading:any;
      password:any;
      message:any;
      notificationArray:any;
      notificationNumber:any;
      location_id:any;
      domicile:any;
      rol_id:any;
      old_rol_id:any;
      userimage:any;
      userimage2:any;
      localityArray:any;
      servicesArray:any;
      myRand:any;
      locationName:any

        ionViewDidLoad() {
        const channel = this.pusherNotify.init();
        let self = this;
        channel.bind('notificationUser', function(data) {
          self.scheduleNotification(data.message,data.hiring.id);
        });
        this.user_id = localStorage.getItem('user_id');
        this.getNotifications();
        this.getLocality();
        this.getServices();
        this.getUser();
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

        scheduleNotification(message,hiring_id) {
      this.localNotifications.schedule({
        id: 1,
        title: 'Atención',
        text: message,
        data: { mydata: hiring_id },
        sound: null
      });
    }

       countCharacter(event){
      this.descriptionCount=this.description.length;
     }
     


       doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
       this.getLocality();
        this.getServices();
        this.getUserRefresh();
    }, 2000);
  }

alertChange(){
    
    console.log("rol id")
    console.log(this.rol_id)

    console.log("old rol id")
    console.log(this.old_rol_id)

    if(this.rol_id != this.old_rol_id){
      this.errorAlert("Al cambiar de tipo de usuario serás redirigido al login");
    }
  }


     getServices() {
      this.httpClient.get(this.url+'/api/services')
      .pipe()
        .subscribe((res:any)=> {
          this.servicesArray=res.data;
      });
      }

       getLocality() {
      this.httpClient.get(this.url+'/api/locations')
      .pipe()
        .subscribe((res:any)=> {
          this.localityArray=res.data;
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
   

      async presentAlert() {
    const toast = await this.toastController.create({
      message: '¡Muy bien! actualizaste tu perfil con éxito.',
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
    //this.goBack();
  }  
   async errorAlert(error) {
    const toast = await this.toastController.create({
      message: error,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }


  
     random(): number {
   let rand = Math.floor(Math.random()*20)+1;
   return rand;       
}
    
 /*  goBack(){
     if (this.rol_id == 2) {
       this.navCtrl.push(TrayaBidderPage); // nav
     }else if(this.rol_id ==1){
       this.navCtrl.push(TrayaPage); // nav
     }
    
  }*/

       getUser(){
          this.loading.present();
        if(localStorage.getItem('token') != null){
          var headers = new HttpHeaders({
            Authorization: localStorage.getItem('token'),
          });
          this.httpClient.get(this.url+'/api/auth/user', { headers })
          .subscribe((response:any)=> {
                 this.loading.dismiss();
             this.myRand=this.random();
            this.rol_id =response.roles[0].id;
            this.old_rol_id =response.roles[0].id;
            this.name=response.user.name;
            this.email=response.user.email;
            this.phone=response.profile.phone;
            this.description=response.profile.description;
            this.userimage = response.image;
            if(response.image.includes("http")){
              this.userimage2=response.image+'?'+this.myRand;
              console.log(this.userimage2);
            }
            this.location_id=response.profile.location_id;
            this.domicile=response.profile.domicile;
            this.services_id=[];
             for(var i=0;i<response.services.length;i++){
                this.services_id.push(response.services[i].service_id)
            }


          },
          err => {
             this.loading.dismiss();
          }
        );
      }else{
         this.loading.dismiss();
        console.log("sesion expirada");
      }
    }



       getUserRefresh(){
        if(localStorage.getItem('token') != null){
          var headers = new HttpHeaders({
            Authorization: localStorage.getItem('token'),
          });
          this.httpClient.get(this.url+'/api/auth/user', { headers })
          .subscribe((response:any)=> {
             this.myRand=this.random();
            this.rol_id =response.roles[0].id;
             this.old_rol_id=response.roles[0].id;
            this.name=response.user.name;
            this.email=response.user.email;
            this.phone=response.profile.phone;
            this.description=response.profile.description;
            this.userimage = response.image;
             if(response.image.includes("http")){
              this.userimage2=response.image+'?'+Math.floor(Math.random()*40)+1;
    
            }
            this.location_id=response.profile.location_id;
            this.domicile=response.profile.domicile;
            this.services_id=[];
             
             for(var i=0;i<response.services.length;i++){
                this.services_id.push(response.services[i].service_id)
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
      

       convertBase64(event) {
            var input = event.target;
            if (input.files && input.files[0]) {
              var reader = new FileReader();
              reader.onload = (e:any) => {
                        this.userimage = e.target.result;
                        this.userimage2 = e.target.result;
              }
              reader.readAsDataURL(input.files[0]);
            }
          }



      updateProfile(){
        var data={
          test:1,
          image:'',
          password:'',
          location_id:'',
          domicile:'',
          name:'',
          email:'',
          phone:'',
          rol_id:'',
          description:'',
          user_id:'',
          services_id:'',
          token:'',
          is_register_completed:true
        };

        var was_register_complete = localStorage.getItem("is_register_completed")
        var locationId = this.location_id
        var location_name = ""
        this.localityArray.forEach(function(data, index){
          if(data.id == locationId){
            location_name = data.name
          }
        })

        this.locationName = location_name

        if (this.userimage !=null) 
          data.image=this.userimage;
        if(this.name=="" || this.name==null){
          this.message="Por favor ingrese su nombre.";
          this.errorAlert(this.message);
        }else if(this.email=="" || this.email==null){
          this.message="Por favor ingrese su correo.";
          this.errorAlert(this.message);
        }
        else if(this.domicile == "" || this.domicile == null){
          this.message="Por favor ingrese su domicilio.";
          this.errorAlert(this.message);
        }
        else if(this.phone=="" || this.phone==null || this.phone=="+54934"){
          this.message="Por favor ingrese su número de teléfono.";
          this.errorAlert(this.message);
        }else{
             this.loading = this.loadingController.create({
                 content: 'Por favor espere...'
             });
              this.loading.present();
          var headers = new Headers();
          headers.append("Accept", 'application/json');
          headers.append('Content-Type', 'application/json');
          this.token = localStorage.getItem('tokenCode');
          this.user_id = localStorage.getItem('user_id');
          data.image=this.userimage;
          data.password=this.password;
          data.location_id=this.location_id;
          data.domicile=this.domicile;
          data.name=this.name;
          data.email=this.email;
          data.phone=this.phone;
          data.rol_id=this.rol_id;
          localStorage.setItem('user_rol',this.rol_id);
          if(localStorage.getItem('is_register_completed') == "0"){
            localStorage.setItem('is_register_completed', "1")
          }
          data.description=this.description;
          data.user_id=this.user_id;
          data.services_id=this.services_id;
          data.token=this.token;

          console.log("test-locationName", this.locationName)
          localStorage.setItem('user_locality_name', this.locationName)
          localStorage.setItem('user_domicile', this.domicile)

          console.log("was_register_complete", was_register_complete)

          //return  this.httpClient.post(this.url+"/api/auth/user/update", {"password":this.password,"image":this.userimage,"location_id":this.location_id,"domicile":this.domicile,"name":this.name,"email":this.email,"phone":this.phone,"rol_id":this.rol_id,"description":this.description,"user_id":this.user_id,"token":this.token,'services':this.services_id})
          return  this.httpClient.post(this.url+"/api/auth/user/update", data)
          .pipe()
          .subscribe((res:any)=> {
            console.log(res);
             this.loading.dismiss();
            this.events.publish('userImage',res);
            this.events.publish('userRol',this.rol_id);
            this.events.publish('userName', res)
            
            window.localStorage.setItem('user_locality_id', this.location_id)
            window.localStorage.setItem('user_locality_name', this.locationName)

            //this.getUserRefresh();
            this.presentAlert();
           // if(this.rol_id != this.old_rol_id){
            //  this.navCtrl.setRoot(LoginPage);
            //}
              if (this.rol_id == 2) 
              {

                if(was_register_complete == "0"){
                  this.navCtrl.setRoot("ServicesJobPage");  
                }else{
                  this.navCtrl.setRoot("TrayaBidderPage"); // nav
                }
              }else if(this.rol_id ==1){
                this.navCtrl.setRoot("TrayaPage"); // nav
              }
          },err => {
             this.loading.dismiss();
            console.log(err.error);
          } ); //subscribe
        }
      }

    }
