import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
/*import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RegisterServicesPage } from '../pages/register-services/register-services';
import { TrayaPage } from '../pages/traya/traya';
import { HiringsPage } from '../pages/hirings/hirings';
import { ServicesPage } from '../pages/services/services';
import { ProfilePage } from '../pages/profile/profile';
import { UsersServicesPage } from '../pages/users-services/users-services';
import { UserHiringPage } from '../pages/user-hiring/user-hiring';
import { ServicesJobPage } from '../pages/services-job/services-job';
import { HiringDetailsPage } from '../pages/hiring-details/hiring-details';
import { UpdateServicesPage } from '../pages/update-services/update-services';
import { DetailsServicesPage } from '../pages/details-services/details-services';
import { TrayaBidderPage } from '../pages/traya-bidder/traya-bidder';
import { ActiveHiringsPage } from '../pages/active-hirings/active-hirings';
import { HistoryHiringsPage } from '../pages/history-hirings/history-hirings';
import { NotificationPage } from '../pages/notification/notification';
import { UserOpinionsPage } from '../pages/user-opinions/user-opinions';
import { DetailHiringNotificationPage } from '../pages/detail-hiring-notification/detail-hiring-notification';
import { ContactPage } from '../pages/contact/contact';
import { AboutTrayaPage } from '../pages/about-traya/about-traya';
import { CreateLocalityPage } from '../pages/create-locality/create-locality';
import { DetailsLocalityPage } from '../pages/details-locality/details-locality';
import { AboutModalPage } from '../pages/about-modal/about-modal';
import { HomeAdminPage } from '../pages/home-admin/home-admin';
import { ManageUsersPage } from '../pages/manage-users/manage-users';
import { MaintenanceModePage } from '../pages/maintenance-mode/maintenance-mode';
import { MaintenancePage } from '../pages/maintenance/maintenance';
import { AboutTrayaBidderPage } from '../pages/about-traya-bidder/about-traya-bidder';
import { AboutTrayaBidderMenuPage } from '../pages/about-traya-bidder-menu/about-traya-bidder-menu';
import { StatisticsPage } from '../pages/statistics/statistics';
import { ManageAdministratorsPage } from '../pages/manage-administrators/manage-administrators';
import { AddAdministratorPage } from '../pages/add-administrator/add-administrator';*/

/*import { UpdateLocalityPage } from '../pages/update-locality/update-locality';
import { ModalInformationPage } from '../pages/modal-information/modal-information';
import { RecoveryPasswordPage } from '../pages/recovery-password/recovery-password';
import { TermsAndConditionsPage } from '../pages/terms-and-conditions/terms-and-conditions';
import { DetailsUsersPage } from '../pages/details-users/details-users';
import { DisabledUsersPage } from '../pages/disabled-users/disabled-users';
import { UpdateModalPage } from '../pages/update-modal/update-modal';
import { TermsPage } from '../pages/terms/terms';*/

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
//import { LongPressModule } from 'ionic-long-press';

import { Push } from '@ionic-native/push';
import { AppVersion } from '@ionic-native/app-version';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { FCM } from '@ionic-native/fcm';
import { AppUpdate } from '@ionic-native/app-update';

@NgModule({
  declarations: [
    MyApp,
    /*HomePage,
    LoginPage,
    RegisterPage,
    RegisterServicesPage,
    TrayaPage,
    HiringsPage,
    ServicesPage,
    ProfilePage,
    UsersServicesPage,
    UserHiringPage,
    ServicesJobPage,
    HiringDetailsPage,
    UpdateServicesPage,
    DetailsServicesPage,
    TrayaBidderPage,
    ActiveHiringsPage,
    HistoryHiringsPage,
    NotificationPage,
    UserOpinionsPage,
    DetailHiringNotificationPage,
    ContactPage,
    AboutTrayaPage,
    CreateLocalityPage,
    UpdateLocalityPage,
    DetailsLocalityPage,
    AboutModalPage,
    HomeAdminPage,
    AboutTrayaBidderPage,
    AboutTrayaBidderMenuPage,
    ModalInformationPage,
    RecoveryPasswordPage,
    TermsAndConditionsPage,
    ManageUsersPage,
    DetailsUsersPage,
    DisabledUsersPage,
    MaintenanceModePage,
    MaintenancePage,
    UpdateModalPage,
    TermsPage,
    StatisticsPage,
    ManageAdministratorsPage,
    AddAdministratorPage,
    AdminAdsPage,
    GoogleLocationPage*/
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
     HttpModule,
    StarRatingModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
    BrMaskerModule
    //LongPressModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    /*HomePage,
    LoginPage,
    RegisterPage,
    RegisterServicesPage,
    TrayaPage,
    HiringsPage,
    ServicesPage,
    ProfilePage,
    UsersServicesPage,
    UserHiringPage,
    ServicesJobPage,
    HiringDetailsPage,
    UpdateServicesPage,
    DetailsServicesPage,
    TrayaBidderPage,
    ActiveHiringsPage,
    HistoryHiringsPage,
    NotificationPage,
    UserOpinionsPage,
    DetailHiringNotificationPage,
    ContactPage,
    AboutTrayaPage,
    CreateLocalityPage,
    UpdateLocalityPage,
    DetailsLocalityPage,
    AboutModalPage,
    HomeAdminPage,
    AboutTrayaBidderPage,
    AboutTrayaBidderMenuPage,
    ModalInformationPage,
    RecoveryPasswordPage,
    TermsAndConditionsPage,
    ManageUsersPage,
    DetailsUsersPage,
    DisabledUsersPage,
    MaintenanceModePage,
    MaintenancePage,
    UpdateModalPage,
    StatisticsPage,
    TermsPage,
    ManageAdministratorsPage,
    AddAdministratorPage,
    AdminAdsPage,
    GoogleLocationPage*/
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CallNumber,
    GooglePlus,
    BackgroundMode,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServiceUrlProvider,
    ServiceNoticesProvider,
    PusherProvider,
    LocalNotifications,
    SocialSharing,
    DeviceAccounts,
    Facebook,
    LoginProvider,
    HelperProvider,
    AppUpdate,
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
