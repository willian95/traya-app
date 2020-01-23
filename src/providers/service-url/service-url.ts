import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ServiceUrlProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceUrlProvider {

  constructor(public http: HttpClient) {
  }
  url:any;

  getUrl(){

    //return this.url = 'https://traya.com.ar/traya-backend/public' //produccion
    //return this.url = 'http://localhost:8000' //local
    return this.url = "https://williantest.sytes.net" //prueba
  }

}
