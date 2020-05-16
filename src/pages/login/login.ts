import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController,LoadingController,Events,ModalController,ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { TrayaPage } from '../traya/traya';
import { TrayaBidderPage } from '../traya-bidder/traya-bidder';
import { ServicesJobPage } from '../services-job/services-job';
import { GooglePlus } from '@ionic-native/google-plus';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { LoginProvider } from '../../providers/login/login';
import { HelperProvider } from '../../providers/helper/helper';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AboutModalPage } from '../about-modal/about-modal';
import { AboutTrayaBidderPage } from '../about-traya-bidder/about-traya-bidder';
import { HomeAdminPage } from '../home-admin/home-admin';
import { RecoveryPasswordPage } from '../recovery-password/recovery-password';
import { TermsAndConditionsPage } from '../terms-and-conditions/terms-and-conditions';
import { MaintenancePage } from '../maintenance/maintenance';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
@IonicPage()

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  url:any;
  constructor(private statusBar: StatusBar, public toastController: ToastController,public modalCtrl: ModalController,private helper: HelperProvider,private googlePlus: GooglePlus,public navCtrl: NavController, public navParams: NavParams,public httpClient: HttpClient,private menu: MenuController,public loadingController: LoadingController,private alertCtrl: AlertController,public events: Events,private serviceUrl:ServiceUrlProvider,private loginProvider:LoginProvider, private fb: Facebook) {
    
    this.showEye = false
    
    this.loading = this.loadingController.create({
      content: 'Por favor espere...'
    });
    this.url=serviceUrl.getUrl();
    this.deviceToken = localStorage.getItem('fcmToken')
    //alert("fcmtoken "+this.deviceToken)
    
    // let status bar overlay webview
    //this.statusBar.overlaysWebView(true);

    this.statusBar.backgroundColorByHexString('#7f0093');

  }
  email:any;
  message:any;
  password:any;
  token:any;
  tokenCode:any;
  loading:any
  passwordType:any;
  showPasswordTextBand:any;
  aboutBandera:any;
  locationP:any;
  config:any;
  deviceToken:any;
  showEye:any

  ionViewDidLoad() {
    //this.menu.swipeEnable(false);
    this.passwordType='password';
    this.showPasswordTextBand=false;
    //console.log(localStorage.getItem('about_band'));
  }

  openModal() {
    if (localStorage.getItem('user_rol') == '2') {
      if(localStorage.getItem('about_band_bidder') == null){
        localStorage.setItem('about_band_bidder','false');
        const bidderModal = this.modalCtrl.create("AboutTrayaBidderPage");
        bidderModal.present();
      }else if(localStorage.getItem('about_band_bidder') === 'false'){
        const bidderModal = this.modalCtrl.create("AboutTrayaBidderPage");
        bidderModal.present();
      }
    }else if(localStorage.getItem('user_rol') == '1'){
      if(localStorage.getItem('about_band') == null){
        localStorage.setItem('about_band','false');
        const profileModal = this.modalCtrl.create("AboutModalPage");
        profileModal.present();
      }else if(localStorage.getItem('about_band') === 'false'){
        const profileModal = this.modalCtrl.create("AboutModalPage");
        profileModal.present();
      }
    }

  }

  sendGoogleData(res){
    return  this.httpClient.post(this.url+"/api/social/socialAuth", {"email": res.email, "userId": res.userId, "name": res.displayName, "deviceToken": this.deviceToken, googleLogin: true})
      .pipe()
      .subscribe((res:any)=> {
        var token = res.token;
        var tokenCode = res.tokenCode;
        var username = res.user.name;
        var userid = res.user.id;
        var valueServices = 'posee';
        var valueServicesBidder = 'posee';
        var useremail = res.user.email;
        var userimage = res.image;
        var userphone = res.profile.phone;
        var userdescription = res.profile.description;
        var user_rol = res.roles[0].id;
        var user_domicile = res.profile.domicile;
        var user_locality_id = res.profile.location_id;
        var averageRatingInt = res.roles[0].id;
        var user_locality_name = res.location.name
        this.locationP = res.location;
        if(this.locationP !=null){
          var location_description = res.location.description;
          localStorage.setItem('location_description',location_description);
        }
        localStorage.setItem('token',token);
        localStorage.setItem('tokenCode',tokenCode);
        localStorage.setItem('user',username);
        localStorage.setItem('user_id',userid);
        localStorage.setItem('useremail',useremail);
        localStorage.setItem('userimage',userimage);
        localStorage.setItem('userphone',userphone);
        localStorage.setItem('userdescription',userdescription);
        localStorage.setItem('user_rol',user_rol);
        localStorage.setItem('averageRatingInt',averageRatingInt);
        localStorage.setItem('user_domicile',user_domicile);
        localStorage.setItem('user_locality_id',user_locality_id);
        localStorage.setItem('user_locality_name',user_locality_name);
        localStorage.setItem('is_register_completed', res.user.is_register_completed)
       
         if(res.roles[0].id ==3 || res.roles[0].id ==4){
          this.navCtrl.setRoot("HomeAdminPage");
          this.events.publish('userLogged',res);
          
        }
        this.getMode(res,valueServices,valueServicesBidder);
      });
  }

  showEyeButton(condition){
    
    this.showEye = condition

  }

  hideEyeButton(){
    this.showEye = false
  }

  loginGoogle(){
    
    this.loading = this.loadingController.create({
      content: 'Por favor espere...'
    });
    this.loading.present();
    this.googlePlus.login({})
    .then(res => {
      
      this.loading.dismiss();
      this.sendGoogleData(res)

    })
    .catch(err => {
      this.loading.dismiss();
      console.error(err)
    });

  }

  loginFacebook(){

    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(
        (res: FacebookLoginResponse) => {
          //console.log(res.authResponse.accessToken)
          this.fetchData(res.authResponse.accessToken)
        })
      .catch(e => console.log('Error logging into Facebook', e));

  }

  fetchData(fbToken){

    this.httpClient.get("https://graph.facebook.com/me?fields=id,name,first_name,last_name,email&access_token="+fbToken)
      .pipe()
      .subscribe((res:any)=> {
        console.log(res)
        this.sendFacebookData(res.name, res.email, res.id)
      })
  }

  sendFacebookData(name, email, userId){

    return  this.httpClient.post(this.url+"/api/social/socialAuth", {"email": email, "userId": userId, "name": name, "deviceToken": this.deviceToken, facebookLogin: true})
      .pipe(
        )
      .subscribe((res:any)=> {
        var token = res.token;
        var tokenCode = res.tokenCode;
        var username = res.user.name;
        var userid = res.user.id;
        var valueServices = 'posee';
        var valueServicesBidder = 'posee';
        var useremail = res.user.email;
        var userimage = res.image;
        var userphone = res.profile.phone;
        var userdescription = res.profile.description;
        var user_rol = res.roles[0].id;
        var user_domicile = res.profile.domicile;
        var user_locality_id = res.profile.location_id;
        var averageRatingInt = res.roles[0].id;
        this.locationP = res.location;
        var user_locality_name = res.location.name
        if(this.locationP !=null){
          var location_description = res.location.description;
          localStorage.setItem('location_description',location_description);
        }
        localStorage.setItem('token',token);
        localStorage.setItem('tokenCode',tokenCode);
        localStorage.setItem('user',username);
        localStorage.setItem('user_id',userid);
        localStorage.setItem('useremail',useremail);
        localStorage.setItem('userimage',userimage);
        localStorage.setItem('userphone',userphone);
        localStorage.setItem('userdescription',userdescription);
        localStorage.setItem('user_rol',user_rol);
        localStorage.setItem('averageRatingInt',averageRatingInt);
        localStorage.setItem('user_domicile',user_domicile);
        localStorage.setItem('user_locality_id',user_locality_id);
        localStorage.setItem('user_locality_name',user_locality_name);
       
         if(res.roles[0].id ==3 || res.roles[0].id ==4){
          this.navCtrl.setRoot("HomeAdminPage");
          this.events.publish('userLogged',res);
          
        }

        //this.getAds()
        this.getMode(res,valueServices,valueServicesBidder);
      });

  }

  recoveryPassword(){
    this.navCtrl.push("RecoveryPasswordPage");
  }

  showPasswordText(){
    this.showPasswordTextBand=true;
    if(this.passwordType =='password'){
      this.passwordType='text';
    }else{
      this.passwordType='password';
      this.showPasswordTextBand=false;
    }

  }
  // googleFacebook(){
    //   this.googlePlus.login({})
    //   .then(res => this.errorAlert(res))
    //   .catch(err => this.errorAlert(err));
    // }


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

    pruebaAlert(user) {
      let alert = this.alertCtrl.create({
        title: ' <img src="assets/imgs/info.png" class="logo2" />',
        subTitle: user,
        buttons: ['Ok']
      });
      alert.present();
    }

    getMode(res:any,valueServices:any,valueServicesBidder:any){
      if(localStorage.getItem('token') != null){
        var headers = new HttpHeaders({
          Authorization: localStorage.getItem('token'),
        });
        this.httpClient.get(this.url+'/api/config', { headers })
        .subscribe((response:any)=> {
          this.config=response.data;
          if(this.config.active ==0){
            //console.log("entro al inactivo")
            this.openModal();
             if (localStorage.getItem('terms') ==null) {
               const termsModal = this.modalCtrl.create("TermsAndConditionsPage");
              termsModal.present();
             }

             if(localStorage.getItem("is_register_completed") == "0"){
              this.events.publish('userLogged',res);
              this.navCtrl.setRoot("ProfilePage");
             }
             else if(res.roles[0].id== 1){
               console.log('traya');
               this.navCtrl.setRoot("TrayaPage");
               this.events.publish('userLogged',res);
               localStorage.setItem('valueServices',valueServices);
             }else if(res.roles[0].id==2 && res.services ==''){
               this.navCtrl.setRoot("ServicesJobPage");
               this.events.publish('userLogged',res);
               localStorage.setItem('valueServicesBidder',valueServicesBidder);
             }else if(res.roles[0].id==2 && res.services !=null){
               this.navCtrl.setRoot("TrayaBidderPage");
               this.events.publish('userLogged',res);
               localStorage.setItem('valueServicesBidder',valueServicesBidder);
             }
          }else if(this.config.active ==1){
            if(res.roles[0].id < 3){
              const maintenanceModal = this.modalCtrl.create("MaintenancePage");
            maintenanceModal.present();
            this.menu.swipeEnable(false);
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

    login() {
      if (this.email == '' || this.email ==null) {
        this.message = "Por favor ingrese su email";
        this.errorAlert(this.message);
      }else if(this.password == "" || this.password ==null){
        this.message="Por favor ingrese su contraseña";
        this.errorAlert(this.message);
      }else{
         this.loading = this.loadingController.create({
        content: 'Por favor espere...'
      });
      this.loading.present();
        var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json' );

      
      return  this.httpClient.post(this.url+"/api/login", {"email":this.email, "password":this.password, "deviceToken": this.deviceToken})
      .pipe()
      .subscribe((res:any)=> {
        this.loading.dismiss();
        var token = res.token;
        var tokenCode = res.tokenCode;
        var username = res.user.name;
        var userid = res.user.id;
        var valueServices = 'posee';
        var valueServicesBidder = 'posee';
        var useremail = res.user.email;
        var userimage = res.image;
        var userphone = res.profile.phone;
        var userdescription = res.profile.description;
        var user_rol = res.roles[0].id;
        var user_domicile = res.profile.domicile;
        var user_locality_id = res.profile.location_id;
        var averageRatingInt = res.roles[0].id;
        this.locationP = res.location;
        let location_name = res.location.name
        if(this.locationP !=null){
          var location_description = res.location.description;
          localStorage.setItem('location_description',location_description);
        }
        localStorage.setItem('token',token);
        localStorage.setItem('tokenCode',tokenCode);
        localStorage.setItem('user',username);
        localStorage.setItem('user_id',userid);
        localStorage.setItem('useremail',useremail);
        localStorage.setItem('userimage',userimage);
        localStorage.setItem('userphone',userphone);
        localStorage.setItem('userdescription',userdescription);
        localStorage.setItem('user_rol',user_rol);
        localStorage.setItem('averageRatingInt',averageRatingInt);
        localStorage.setItem('user_domicile',user_domicile);
        localStorage.setItem('user_locality_id',user_locality_id);
        localStorage.setItem('user_locality_name',location_name);
       
         if(res.roles[0].id ==3 || res.roles[0].id ==4){
          this.navCtrl.setRoot("HomeAdminPage");
          this.events.publish('userLogged',res);
          
        }
        this.getMode(res,valueServices,valueServicesBidder);

      },err => {
        this.loading.dismiss();
        this.errorAlert(err.error.msg);
        console.log(err);
      } );
    }
      }


  }
