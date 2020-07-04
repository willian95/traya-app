import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceUrlProvider } from '../../providers/service-url/service-url';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SuperTabs } from 'ionic2-super-tabs';
import { Events } from 'ionic-angular';

/**
 * Generated class for the FavoriteTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorite-tabs',
  templateUrl: 'favorite-tabs.html',
})
export class FavoriteTabsPage {

  @ViewChild(SuperTabs) superTabs: SuperTabs;
  page1: any = "FavoritePage";
  page2: any = "HiringsPage";
  hiringCount:any
  url:any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, private serviceUrl:ServiceUrlProvider, public httpClient: HttpClient) {
    this.hiringCount = 0;
    this.url=serviceUrl.getUrl();

    this.countActiveHirings()

    this.events.subscribe('countHirings', (data) =>{
      this.countActiveHirings()
    });

  }

  countActiveHirings(){

    if(localStorage.getItem('token') != null){
      var headers = new HttpHeaders({
        Authorization: localStorage.getItem('token'),
      });
      this.httpClient.post(this.url+'/api/countActive/hiring', {"user_id": localStorage.getItem('user_id')})
      .subscribe((response:any)=> {
       
        if(response.success == true){
          
          if(localStorage.getItem('user_rol') == "1"){
            
            this.hiringCount = response.applicantCount

          }else if(localStorage.getItem('user_rol') == "2"){
            
            this.hiringCount = response.bidderCount
          
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoriteTabsPage');
  }

  onTabSelect(ev: any){
    var indexTab =ev.index;
    localStorage.setItem('indexTab',indexTab);
 
     if(indexTab == 1){
 
     }
 
    if(localStorage.getItem('indexTab') =='1'){
      this.events.publish('changeIndex','res');
    }
 
  }

}
