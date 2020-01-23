import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class HelperProvider {
  loading;
  constructor(public http: HttpClient,public loadingCtrl: LoadingController, public toastCtrl: ToastController) {  }
  showLoading(message = '') {
    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();
  }

  hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast-success"
    });
    toast.present();
  }

  showError(data) {
    this.hideLoading();
    this.presentToast(data);
  }
}