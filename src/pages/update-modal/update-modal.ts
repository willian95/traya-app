import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController   } from 'ionic-angular';
import { AppUpdate } from '@ionic-native/app-update';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { NgZone } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';

/**
 * Generated class for the UpdateModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-modal',
  templateUrl: 'update-modal.html',
})
export class UpdateModalPage {
  url:any
  downProg:any = null
  showView = false

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, private appUpdate: AppUpdate, private serviceUrl:ServiceUrlProvider, private transfer: FileTransfer, private file: File, private fileOpener: FileOpener, private ngZone: NgZone, private androidPermissions: AndroidPermissions) {
    this.url=serviceUrl.getUrl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdateModalPage');
  }

   closeModal() {
    this.viewCtrl.dismiss();
    //window.location.href="market://details?id=com.ionicframework.traya";
  
  }
 dontSee() {
    localStorage.setItem('UpdateAPK','true');
    this.viewCtrl.dismiss();
  }

  update(){

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then( (result) => {
      if(result.hasPermission){

        this.showView = true
        const fileTransfer = this.transfer.create(); //this.tranfer is from "@ionic-native/file-transfer";
        let fileUrl = this.url+"/traya.apk";
        
        const savePath = this.file.externalRootDirectory  + '/Download/' + 'traya.apk';
        
          fileTransfer.onProgress((progressEvent) => {
            this.ngZone.run(() => {
            //console.log(progressEvent);
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            console.log(perc)
            this.downProg = perc;
            })
          });
          fileTransfer.download(fileUrl, savePath)
          .then((entry) => {

            const nativePath = entry.toURL();
            
            this.runNewVersionApk(nativePath);
          }, (err) => {
            console.log(err)
            alert("SERVER ERROR TO DOWNLOAD FILE")
          });

      }else{

        this.androidPermissions.requestPermissions(
            [
                this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
                this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
            ]
        );

      }
      /**/
      })

  }

  runNewVersionApk(path) {
    //this.fileOpener is from '@ionic-native/file-opener';
    this.fileOpener.open(path, 'application/vnd.android.package-archive');
  }

  
 



}
