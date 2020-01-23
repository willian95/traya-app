import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ServiceNoticesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceNoticesProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ServiceNoticesProvider Provider');
  }
  notificationArray:any;

  // getNotifications(user_id){
  //   console.log("epa");
  //   this.httpClient.get(this.url+"/api/notification/"+user_id+'?filters={"read":0}')
  //   .pipe()
  //   .subscribe((res:any)=> {
  //     this.notificationArray=res.data;
  //     console.log(this.notificationArray);
  //   });
  // }

}
