import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import { BackgroundMode } from '@ionic-native/background-mode';

import { CallNumber } from '@ionic-native/call-number';
import { GooglePlus } from '@ionic-native/google-plus';
import { StarRatingModule } from 'ionic3-star-rating';
import { GoogleMaps } from '@ionic-native/google-maps';

import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { IonicStorageModule } from '@ionic/storage';
import { ServiceUrlProvider } from '../providers/service-url/service-url';
import { ServiceNoticesProvider } from '../providers/service-notices/service-notices';
import { PusherProvider } from '../providers/pusher/pusher';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DeviceAccounts } from '@ionic-native/device-accounts';
import { LoginProvider } from '../providers/login/login';
import { HelperProvider } from '../providers/helper/helper';
import { AdminAdsPage } from '../pages/admin-ads/admin-ads';
import { GoogleLocationPage } from '../pages/google-location/google-location';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { AndroidPermissions } from '@ionic-native/android-permissions';
//import { LongPressModule } from 'ionic-long-press';

import { Push } from '@ionic-native/push';
import { AppVersion } from '@ionic-native/app-version';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { FCM } from '@ionic-native/fcm';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

//const config: SocketIoConfig = {url: "wss://traya-chat.sytes.net", options:{}}
const config: SocketIoConfig = {url: "wss://chat.traya.com.ar", options:{}}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
     HttpModule,
    StarRatingModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
    BrMaskerModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CallNumber,
    GooglePlus,
    AndroidPermissions,
    BackgroundMode,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServiceUrlProvider,
    ServiceNoticesProvider,
    PusherProvider,
    LocalNotifications,
    SocialSharing,
    DeviceAccounts,
    Facebook,
    File,
    Transfer,
    Camera,
    FilePath,
    FileOpener,
    FileTransfer,
    LoginProvider,
    HelperProvider,
    InAppBrowser,
    AppVersion,
    Geolocation,
    Push,
    FCM,
    GoogleMaps,
    LaunchNavigator,
    NativeGeocoder
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
