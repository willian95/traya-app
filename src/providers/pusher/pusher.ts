import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { Events } from 'ionic-angular';

/*
Generated class for the PusherProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class PusherProvider {
  user_id:any;

  constructor(public events: Events) {
     this.events.subscribe('userLogged',(res)=>{
      this.user_id = res.user.id
    });

  }
  channel;

  public init() {
      var pusher = new Pusher('2a629b96ad637980d3db', {
      cluster: 'us2',
      encrypted: true,
    });


    this.channel = pusher.subscribe('notification-'+this.user_id);
    return this.channel;
  }
}
