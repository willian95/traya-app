import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { HelperProvider } from '../helper/helper';
/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {

  constructor(public http: HttpClient,private googlePlus:GooglePlus, private helper:HelperProvider) {
  }

 googleLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
        this.googlePlus.login({
            'scopes': 'profile',
            'webClientId': '890974507509-qcg692hu8tgi851sqpo3mne7u5sn6647.apps.googleusercontent.com'
        }).then(res => {
              resolve(res);
            },err => {
              this.helper.showError(err);   
                reject(err);
            });
        }).catch(err => { 
            this.helper.showError(err);       
      });
}



}
