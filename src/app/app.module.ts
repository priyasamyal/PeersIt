import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Platform, Nav, NavController } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { NumericModule } from 'ionic2-numericpicker'
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { Events } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';


import { MyApp } from './app.component';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { CustomerHomePage } from '../pages/customer-home/customer-home';
import { CustomerNewOrderPage } from '../pages/customer-new-order/customer-new-order';
import { CustomerOrderDetailsPage } from '../pages/customer-order-details/customer-order-details';
import { CustomerOrderHistoryPage } from '../pages/customer-order-history/customer-order-history';
import { CustomerOrderHistoryFilterPage } from '../pages/customer-order-history-filter/customer-order-history-filter';
import { CustomerSettingsPage } from '../pages/customer-settings/customer-settings';
import { CustomerOrderListPage } from '../pages/customer-order-list/customer-order-list';
import { CustomerOrderRunningListPage } from '../pages/customer-order-running-list/customer-order-running-list';
import { CustomerHumanAtmPage } from '../pages/customer-human-atm/customer-human-atm';
import { CustomerHumanAtmEditPage } from '../pages/customer-human-atm-edit/customer-human-atm-edit';
import { CustomerBankPage } from '../pages/customer-bank/customer-bank';
import { CustomerProfilePage } from '../pages/customer-profile/customer-profile';
import { CustomerAddressPage } from '../pages/customer-address/customer-address';
import { CustomerAddAddressPage } from '../pages/customer-add-address/customer-add-address';
import { CustomerEditOrderPage } from '../pages/customer-edit-order/customer-edit-order';
import { CustomerSecretCodeListPage } from '../pages/customer-secret-code-list/customer-secret-code-list';
import { CustomerChatViewPage } from '../pages/customer-chat-view/customer-chat-view';
import { CustomerChatPage } from '../pages/customer-chat/customer-chat';
import { CustomerNotificationsPage } from '../pages/customer-notifications/customer-notifications';
import { CustomerBankDetailsPage } from '../pages/customer-bank-details/customer-bank-details';
import { CustomerOrderInvoicePage } from '../pages/customer-order-invoice/customer-order-invoice';
import { CustomerPaymentOptionsPage } from '../pages/customer-payment-options/customer-payment-options';
import { EmailVerificationPage } from '../pages/email-verification/email-verification';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { InitialPage } from '../pages/initial/initial';
import { LoginPage } from '../pages/login/login';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { ServiceHomePage } from '../pages/service-home/service-home';
import { ServiceOrderFilterPage } from '../pages/service-order-filter/service-order-filter';
import { ServiceOrderHistoryPage } from '../pages/service-order-history/service-order-history';
import { ServiceOrderHistoryFilterPage } from '../pages/service-order-history-filter/service-order-history-filter';
import { ServiceOrderListPage } from '../pages/service-order-list/service-order-list';
import { ServiceOrderMapPage } from '../pages/service-order-map/service-order-map';
import { SignupPage } from '../pages/signup/signup';
import { ServiceAcceptedOrdersPage } from '../pages/service-accepted-orders/service-accepted-orders';
import { ServiceOrderCompletePage } from '../pages/service-order-complete/service-order-complete';
import { ServiceOrderDetailPage } from '../pages/service-order-detail/service-order-detail';
import { ServiceOrderMapListPage } from '../pages/service-order-map-list/service-order-map-list';
import { ServiceProfilePage } from '../pages/service-profile/service-profile';
import { ServicesSettingsPage } from '../pages/services-settings/services-settings';
import { ServiceAddressPage } from '../pages/service-address/service-address';
import { ServiceAddAddressPage } from '../pages/service-add-address/service-add-address';
import { ServiceNotificationsPage } from '../pages/service-notifications/service-notifications';

import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';
import { MapPage } from '../pages/map/map';


import { BackgroundImage } from '../components/background-image/background-image';
import { ColorRadio } from '../components/color-radio/color-radio';
import { CounterInput } from '../components/counter-input/counter-input';
import { GoogleMap } from '../components/google-map/google-map';
import { PreloadImage } from '../components/preload-image/preload-image';
import { Rating } from '../components/rating/rating';
import { ShowHideContainer } from '../components/show-hide-password/show-hide-container';
import { ShowHideInput } from '../components/show-hide-password/show-hide-input';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { Device } from '@ionic-native/device';
import { Geolocation } from '@ionic-native/geolocation';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Stripe } from '@ionic-native/stripe';

import { Api } from '../providers/api/api';
import { Toast } from '../providers/toast/toast';
import { UserProvider } from '../providers/user/user';
import { FacebookProvider } from '../providers/facebook/facebook';
import { GoogleProvider } from '../providers/google/google';
import { AlertProvider } from '../providers/alert/alert';
import { MapProvider } from '../providers/map/map';
import { OrderProvider } from '../providers/order/order';
import { UtilsProvider } from '../providers/utils/utils';
import { AuthProvider } from '../providers/auth-provider/auth-provider';
import { ChatsProvider } from '../providers/chats-provider/chats-provider';


export const firebaseConfig = {
  apiKey: "AIzaSyDvP4he1zDsgszS_HA-VyxdggTKMhOEcS8",
  authDomain: "peersit-test.firebaseapp.com",
  databaseURL: "https://peersit-test.firebaseio.com",
  projectId: "peersit-test",
  storageBucket: "peersit-test.appspot.com",
  messagingSenderId: "451801786922"

};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    MyApp,
    ChangePasswordPage,
    CustomerHomePage,
    CustomerNewOrderPage,
    CustomerOrderDetailsPage,
    CustomerOrderHistoryPage,
    CustomerOrderHistoryFilterPage,
    CustomerOrderListPage,
    CustomerHumanAtmPage,
    CustomerHumanAtmEditPage,
    CustomerBankPage,
    CustomerProfilePage,
    CustomerSettingsPage,
    CustomerAddressPage,
    CustomerAddAddressPage,
    CustomerOrderInvoicePage,
    CustomerEditOrderPage,
    CustomerBankDetailsPage,
    CustomerSecretCodeListPage,
    CustomerChatPage,
    CustomerChatViewPage,
    CustomerNotificationsPage,
    CustomerPaymentOptionsPage,
    EmailVerificationPage,
    ForgotPasswordPage,
    InitialPage,
    LoginPage,
    PrivacyPolicyPage,
    ServiceHomePage,
    ServiceOrderFilterPage,
    ServiceOrderHistoryPage,
    ServiceOrderHistoryFilterPage,
    ServiceOrderListPage,
    ServiceOrderMapPage,
    ServiceOrderMapListPage,
    ServiceProfilePage,
    ServicesSettingsPage,
    ServiceAddressPage,
    ServiceAddAddressPage,
    SignupPage,
    ServiceNotificationsPage,
    ServiceAcceptedOrdersPage,
    ServiceOrderCompletePage,
    CustomerOrderRunningListPage,
    ServiceOrderDetailPage,
    TermsOfServicePage,
    MapPage,


    BackgroundImage,
    ColorRadio,
    CounterInput,
    GoogleMap,
    PreloadImage,
    Rating,
    ShowHideContainer,
    ShowHideInput

  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    NumericModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ChangePasswordPage,
    CustomerHomePage,
    CustomerNewOrderPage,
    CustomerOrderDetailsPage,
    CustomerOrderHistoryPage,
    CustomerOrderHistoryFilterPage,
    CustomerOrderListPage,
    CustomerOrderRunningListPage,
    CustomerSettingsPage,
    CustomerHumanAtmPage,
    CustomerHumanAtmEditPage,
    CustomerBankDetailsPage,
    CustomerProfilePage,
    CustomerBankPage,
    CustomerAddressPage,
    CustomerAddAddressPage,
    CustomerEditOrderPage,
    CustomerOrderInvoicePage,
    CustomerSecretCodeListPage,
    CustomerNotificationsPage,
    CustomerChatPage,
    CustomerPaymentOptionsPage,
    CustomerChatViewPage,
    EmailVerificationPage,
    ForgotPasswordPage,
    InitialPage,
    LoginPage,
    PrivacyPolicyPage,
    ServiceHomePage,
    ServiceOrderFilterPage,
    ServiceOrderHistoryPage,
    ServiceOrderHistoryFilterPage,
    ServiceOrderListPage,
    ServiceProfilePage,
    ServicesSettingsPage,
    ServiceOrderMapPage,
    ServiceOrderMapListPage,
    ServiceAcceptedOrdersPage,
    ServiceAddressPage,
    ServiceAddAddressPage,
    ServiceNotificationsPage,
    SignupPage,
    ServiceOrderCompletePage,
    ServiceOrderDetailPage,
    TermsOfServicePage,
    MapPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    Facebook,
    Push,
    NativeStorage,
    Device,
    Geolocation,
    NativeGeocoder,
    Stripe,
    PayPal,
    File,
    Transfer,
    Camera,
    CallNumber,
    FilePath,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Api,
    Toast,
    UserProvider,
    FacebookProvider,
    GoogleProvider,
    AlertProvider,
    MapProvider,
    OrderProvider,
    UtilsProvider,
    AuthProvider,
    ChatsProvider,
    UserProvider,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule {
  @ViewChild(NavController) nav: NavController;
  constructor(
    private push: Push,
    private platform: Platform,
    public events: Events,
    private userProvider: UserProvider,
 
  ) {
    this.platform.ready().then(() => {

          // to check if we have permission
            this.push.hasPermission()
              .then((res: any) => {
                if (res.isEnabled)
                  console.log('We have permission to send push notifications');
                else
                  console.log('We do not have permission to send push notifications');
              });

            // to initialize push notifications
            const options: PushOptions = {
              android: {
                senderID: '451801786922',
                forceShow:true
              },
              ios: {
                senderID:  '451801786922',
                gcmSandbox : true,
                alert: 'true',
                badge: true,
                sound: 'true',

              },
              windows: {}
            };
            const pushObject: PushObject = this.push.init(options);
            //   pushObject.on('notificationOpenedCallback').subscribe((jsonData: any) => console.log("json data.................",jsonData));
            pushObject.on('notification').subscribe((notification: any) => {
             console.log(notification);
              console.log("Badge count............", this.userProvider.badge);
              this.userProvider.badge +=1;
              console.log("Badge count after increment............", this.userProvider.badge);
              this.events.publish('badge:created', this.userProvider.badge);
      /*         if (notification.additionalData.foreground) {
               alert("foregraound notification")
               
              }
              if (notification.additionalData.coldstart) {
                alert("background notification")
             //   this.nav.push('NewpagePage');
              }
       */        //  alert(1);
              //   console.log('Received a notification', notification);
              //   console.log(notification.additionalData.data)
              //   this.nativeStorage.setItem('notification', notification.additionalData.data);
              // this.nav.push(InitialPage);
              //  if(notification.additionalData.data!=""){

              //  }

              // this.rootPage = InitialPage;


            }, (err) => {

            });
            pushObject.on('registration').subscribe((registration: any) => {
              console.log("resgistration token........",registration)
             this.userProvider.fcmId = registration.registrationId;

            },(err)=>{
               console.log("error while registration token...........",err);
            });
            pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
 });
  }

}