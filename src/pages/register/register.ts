import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController,LoadingController,ToastController,ModalController,Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { TermsAndConditionsPage } from '../terms-and-conditions/terms-and-conditions';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { AboutTrayaPage } from '../about-traya/about-traya';
import { AboutModalPage } from '../about-modal/about-modal';
import { AboutTrayaBidderPage } from '../about-traya-bidder/about-traya-bidder';
import { HomeAdminPage } from '../home-admin/home-admin';
import { RecoveryPasswordPage } from '../recovery-password/recovery-password';
import { ProfilePage } from '../profile/profile';
import { TrayaPage } from '../traya/traya';
import { TrayaBidderPage } from '../traya-bidder/traya-bidder';
import { ServicesJobPage } from '../services-job/services-job';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  url:any;
  constructor(public events: Events,public modalCtrl: ModalController,public toastController: ToastController,public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, private alertCtrl: AlertController,private menu: MenuController,public loadingController: LoadingController,private serviceUrl:ServiceUrlProvider) {
    this.loading = this.loadingController.create({
             content: 'Por favor espere...'
         });


         this.url=serviceUrl.getUrl();

  }
  image:any;
  name:any;
  email:any;
  phone:any;
  password:any;
  passwordRepeat:any;
  passwordTypeRepeat:any;
  domicile:any;
  location_id:any;
  rol_id:any;
  description:any;
  loading:any;
  _alert:any;
  message:any;
  passwordType:any;
  showPasswordTextBand:any;
  showPasswordTextBandRepeat:any;
  localityArray:any;
  descriptionLocation:any;
   aboutBandera:any;
  locationP:any;
  showEyePass:any
  showEyeRePass:any

   ionViewDidLoad() {
      //this.menu.swipeEnable(false);
      this.passwordType='password';
      this.passwordTypeRepeat='password';
      this.showPasswordTextBand=false;
      this.getLocality();
      this.image=this.url+"/assets/images/generic-user.png";
  }
validatePassword(){
  if(this.password != this.passwordRepeat){
    this.errorAlert('Las contraseñas no coinciden');
  }
}
validatePasswordLength($event){
  if (this.password.length<6) {
    this.errorAlert('La contraseña debe ser mayor o igual a 6 digitos');
    this.password="";
  }
}
  addPhoneFormat(){
    this.phone="+549"
  }
  terms(){
    this.navCtrl.push(TermsAndConditionsPage);

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
showPasswordTextRepeat(){
  this.showPasswordTextBandRepeat=true;
  if(this.passwordTypeRepeat =='password'){
    this.passwordTypeRepeat='text';
  }else{
    this.passwordTypeRepeat='password';
    this.showPasswordTextBandRepeat=false;
  }

}

async presentAlert() {
    const toast = await this.toastController.create({
      message: "¡Usuario registrado con éxito! por favor espere mientras inicia sesión",
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

  showEyeButtonPass(){
    
    this.showEyeRePass = false
    this.showEyePass = true

  }


  showEyeButtonRePass(){
    
    this.showEyePass = false
    this.showEyeRePass = true

  }

  hideEyeButton(){
    this.showEyePass = false
    this.showEyeRePass = false
  }

  domicileFocus(){
    this.hideEyeButton()
    
    if(this.domicile == null || this.domicile == ""){
      this.domicile = "Calle y Número"
      let domicile = document.getElementById("domicile")
      domicile.style.color = "#999"
    }
  }

  checkDomicileInput(){
    console.log("entre")
      if(this.domicile.indexOf("Calle y Número") > -1){

        this.domicile = this.domicile.substring(this.domicile.length - 1, this.domicile.length)
        let domicile = document.getElementById("domicile")
        domicile.style.color = "#000"
  
      }
    
  }


async errorAlert(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 10000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }


      convertBase64(event) {
        var input = event.target;
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = (e:any) => {
                    this.image = e.target.result;
          }
          reader.readAsDataURL(input.files[0]);
        }
      }

    cleanInput(){
      this.image="";
      this.name="";
      this.email="";
      this.phone="";
      this.password="";
      this.rol_id="";
      this.description="";
    }

      openModal() {
    if (localStorage.getItem('user_rol') == '2') {
       if(localStorage.getItem('about_band_bidder') == null){
        localStorage.setItem('about_band_bidder','false');
        const bidderModal = this.modalCtrl.create(AboutTrayaBidderPage);
        bidderModal.present();
      }else if(localStorage.getItem('about_band_bidder') === 'false'){
        const bidderModal = this.modalCtrl.create(AboutTrayaBidderPage);
        bidderModal.present();
      }
    }else if(localStorage.getItem('user_rol') == '1'){
      if(localStorage.getItem('about_band') == null){
        localStorage.setItem('about_band','false');
        const profileModal = this.modalCtrl.create(AboutModalPage);
        profileModal.present();
      }else if(localStorage.getItem('about_band') === 'false'){
        const profileModal = this.modalCtrl.create(AboutModalPage);
        profileModal.present();
      }
    }

     

  }


      login(email,password) {
  
       this.loading = this.loadingController.create({
             content: 'Por favor espere...'
         });
        this.loading.present();

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    return  this.httpClient.post(this.url+"/api/login", {"email":email, "password":password})
    .pipe(
    )
    .subscribe((res:any)=> {
      this.loading.dismiss();
      var token = res.token;
      var tokenCode = res.tokenCode;
      var username = res.user.name;
      var userid = res.user.id;
      var valueServices = 'posee';
      var useremail = res.user.email;
      var userimage = res.image;
      var userphone = res.profile.phone;
      var userdescription = res.profile.description;
      var user_rol = res.roles[0].id;
      var user_domicile = res.profile.domicile;
      var user_locality_id = res.profile.location_id;
      var averageRatingInt = res.roles[0].id;
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
      this.openModal();
      const termsModal = this.modalCtrl.create(TermsAndConditionsPage);
       termsModal.present();

      if(res.roles[0].id== 1){
        this.navCtrl.setRoot(TrayaPage);
        this.events.publish('userLogged',res);
        localStorage.setItem('valueServices',valueServices);
      }else if(res.roles[0].id==2 && res.services ==''){
      this.navCtrl.setRoot(ServicesJobPage);
      this.events.publish('userLogged',res);
    }else if(res.roles[0].id==2 && res.services !=null){
      this.navCtrl.setRoot(TrayaBidderPage);
      this.events.publish('userLogged',res);
    }
    else if(res.roles[0].id ==3){
      this.navCtrl.setRoot(HomeAdminPage);
      this.events.publish('userLogged',res);
    }
  },err => {
    this.loading.dismiss();
    this.errorAlert(err.error.msg);
  } ); //subscribe
}


    addUsers() {
      if(this.name=="" || this.name==null){
       this.message = "Por favor ingrese el nombre.";
       this.errorAlert(this.message);
      }else if(this.phone=="" || this.phone==null){
        this.message="Por favor ingrese el número celular.";
        this.errorAlert(this.message);
      }else if(this.location_id=="" || this.location_id==null){
        this.message="Por favor ingrese su localidad.";
        this.errorAlert(this.message);
      }else if(this.domicile=="" || this.domicile==null){
        this.message="Por favor ingrese su domicilio.";
        this.errorAlert(this.message);
      }else if(this.email=="" || this.email==null){
        this.message="Por favor ingrese el correo electronico.";
        this.errorAlert(this.message);
      }else if(this.password=="" || this.password ==null){
      this.message="Por favor ingrese la contraseña.";
        this.errorAlert(this.message);
      }else if(this.rol_id=="" || this.rol_id==null){
        this.message="Por favor seleccione el tipo de usuario.";
        this.errorAlert(this.message);
      }else if(this.password != this.passwordRepeat){
          this.message="Las contraseñas no coinciden.";
          this.errorAlert(this.message);
      }else if(this.image=="" || this.image==null){
        this.message="Por favor seleccione la imagen.";
      }else{
        
           this.loading = this.loadingController.create({
             content: 'Por favor espere...'
         });
            this.loading.present();

       var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        return  this.httpClient.post(this.url+"/api/signup", {"name":this.name,"email":this.email, "password":this.password,"phone":this.phone,"rol_id":this.rol_id,"description":this.description,"image":this.image,"domicile":this.domicile,"location_id":this.location_id})
        .pipe(
        )
        .subscribe((res:any)=> {
          this.loading.dismiss();
          this.presentAlert();
          this.login(this.email,this.password);
          this.cleanInput();
          //this.navCtrl.push(LoginPage);
        },err => {
              this.loading.dismiss();
              var errors=JSON.parse(err.error.errors);
          if("email" in errors){
              this.errorAlert(errors.email);
               }

              

        }); //subscribe
      }
    }

  getLocality() {
    this.httpClient.get(this.url+'/api/locations')
    .pipe()
      .subscribe((res:any)=> {
        console.log('res.data');
        console.log(res.data);
        this.localityArray=res.data;
    });
  }

  getDescription(){
     for (var i = 0; i < this.localityArray.length; i++) {
      if(this.location_id == this.localityArray[i].id){
        this.descriptionLocation = this.localityArray[i].description;
        this.toastLocationNotification(this.descriptionLocation);
        } //if
      }//for

  }


async toastLocationNotification(description) {
    const toast = await this.toastController.create({
      message: description,
      duration: 6000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'your-toast-css-class'
    });
    toast.present();
  }

}
