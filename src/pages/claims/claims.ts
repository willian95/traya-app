import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the ClaimsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-claims',
  templateUrl: 'claims.html',
})
export class ClaimsPage {

  claimType:any = ""
  images:any = []
  sugerence:any = ""
  description:any = ""
  url:any = ""
  loading:any
  number:any

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private camera: Camera, private toastController: ToastController, public httpClient: HttpClient, private serviceUrl:ServiceUrlProvider, public loadingController: LoadingController, public actionSheetController: ActionSheetController) {
    this.url = this.serviceUrl.getUrl()
    
    
  }

  public takePicture(sourceType) {
    var options = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((imageData) => {
      let image  = 'data:image/jpeg;base64,' + imageData;
      this.images.push(image)
      /*if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        console.log("test-take-picture", currentName, correctPath)
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        //this.uploadImage()
      }*/
    }, (err) => {
      console.log(err)
    });
  }

  ionViewDidEnter(){
    this.getNumber()
  }

  chooseImageSource() {
    const actionSheet = this.actionSheetController.create({
      //title: 'Modify your albu',
      buttons: [
        {
          text: 'Cámara',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA)
          }
        },{
          text: 'Archivos',
          handler: () => {
            this.openGallery()
            //document.getElementById('image-change-app').click();
          }
        }
      ]
    });
    actionSheet.present();
  }


  delete(i){
    this.images.splice(i, 1)
  }

  getNumber(){

    this.httpClient.get(this.url+"/api/claim/number").subscribe((res:any)=> {

      this.number = res.number

    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimsPage');

    let alert = this.alertCtrl.create({
      subTitle: "La sección de 'Reclamos' tiene como objetivo establecer un canal de comunicación rápido y confiable que permita detectar y solucionar los reclamos y sugerencias de los ciudadanos. Su reclamo y/o sugerencia será enviado al municipio, por favor sea claro en la explicación y aporte toda la información que crea conveniente",
      buttons: ['OK']
    });
    alert.present();

  }

  async showToast(error){
    const toast = await this.toastController.create({
      message: error,
      duration: 5000,
      showCloseButton: true,
      closeButtonText: 'Cerrar',
      cssClass: 'urgent-notification'
    });
    toast.present();
  }

  sendClaim(){

    if(this.description == ""){
      this.showToast("Debe añadir una descripción a su reclamo")
    }else if(this.images.length == 0){
      this.showToast("Debe adjuntar al menos una imagen")
    }else{
      
      this.loading = this.loadingController.create({
        content: 'Por favor espere...'
      });
      this.loading.present()

      let type = 1
      if(this.claimType == "sugerence"){
        type = 2
      }
      let locality = window.localStorage.getItem("user_locality_id")
      this.httpClient.post(this.url+"/api/claim/store", {description: this.description, type: type, images: this.images, locality: locality, name: window.localStorage.getItem("user"), phone: window.localStorage.getItem("userphone"), email: window.localStorage.getItem("useremail"), domicile: window.localStorage.getItem("user_domicile")}).subscribe((res:any) => {
        this.loading.dismiss()
        if(res.success == true){

          this.showToast(res.msg)
          this.navCtrl.pop()

        }else{
          this.showToast(res.msg)
        }

      })

    }

  }

  sendSugerence(){
    if(this.sugerence == ""){
      this.showToast("Debe añadir una descripción a su sugerencia")
    }else{

      this.loading = this.loadingController.create({
        content: 'Por favor espere...'
      });
      this.loading.present()

      this.httpClient.post(this.url+"/api/claim/store", {description: this.sugerence, type: 2}).subscribe((res:any) => {
        this.loading.dismiss()
        if(res.success == true){

          this.showToast(res.msg)
          this.navCtrl.pop()

        }else{
          this.showToast(res.msg)
        }

      })
    }
  }

  openGallery(){

    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let image  = 'data:image/jpeg;base64,' + imageData;
      this.images.push(image)
    }, (err) => {
      // Handle error
    })
  }



}
