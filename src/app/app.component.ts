import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { NativeStorage } from '@ionic-native/native-storage';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFire } from 'angularfire2';
import { Events } from 'ionic-angular';

import { LoginPage } from '../pages/login/login';
import { InitialPage } from '../pages/initial/initial';
import { CustomerHomePage } from '../pages/customer-home/customer-home';
import { CustomerNewOrderPage } from '../pages/customer-new-order/customer-new-order';
import { CustomerOrderHistoryPage } from '../pages/customer-order-history/customer-order-history';
import { CustomerOrderListPage } from '../pages/customer-order-list/customer-order-list';
import { CustomerOrderDetailsPage } from '../pages/customer-order-details/customer-order-details';
import { CustomerSettingsPage } from '../pages/customer-settings/customer-settings';
import { CustomerHumanAtmPage } from '../pages/customer-human-atm/customer-human-atm';
import { CustomerBankPage } from '../pages/customer-bank/customer-bank';
import { CustomerProfilePage } from '../pages/customer-profile/customer-profile';
import { CustomerAddressPage } from '../pages/customer-address/customer-address';
import { CustomerAddAddressPage } from '../pages/customer-add-address/customer-add-address';
import { CustomerEditOrderPage } from '../pages/customer-edit-order/customer-edit-order';
import { CustomerSecretCodeListPage } from '../pages/customer-secret-code-list/customer-secret-code-list';
import { CustomerChatViewPage } from '../pages/customer-chat-view/customer-chat-view';
import { CustomerChatPage } from '../pages/customer-chat/customer-chat';
import { CustomerNotificationsPage } from '../pages/customer-notifications/customer-notifications';
import { CustomerOrderRunningListPage } from '../pages/customer-order-running-list/customer-order-running-list';
import { CustomerBankDetailsPage } from '../pages/customer-bank-details/customer-bank-details';

import { ServiceHomePage } from '../pages/service-home/service-home';
import { ServiceOrderHistoryPage } from '../pages/service-order-history/service-order-history';
import { ServiceOrderListPage } from '../pages/service-order-list/service-order-list';
import { ServiceOrderMapPage } from '../pages/service-order-map/service-order-map';
import { ServiceAcceptedOrdersPage } from '../pages/service-accepted-orders/service-accepted-orders';
import { ServiceOrderDetailPage } from '../pages/service-order-detail/service-order-detail';
import { ServiceOrderMapListPage } from '../pages/service-order-map-list/service-order-map-list';
import { ServiceProfilePage } from '../pages/service-profile/service-profile';
import { ServicesSettingsPage } from '../pages/services-settings/services-settings';
import { ServiceAddressPage } from '../pages/service-address/service-address';
import { ServiceAddAddressPage } from '../pages/service-add-address/service-add-address';
import { ServiceNotificationsPage } from '../pages/service-notifications/service-notifications';

import { MapPage } from '../pages/map/map';

import { UserProvider } from '../providers/user/user';
import { UtilsProvider } from '../providers/utils/utils';
import { FacebookProvider } from '../providers/facebook/facebook';
import { GoogleProvider } from '../providers/google/google';
import { AuthProvider } from '../providers/auth-provider/auth-provider';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
@Component({
  templateUrl: 'app.html',
  providers: [Push]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  badgeCount: number = 0;
  pages1: Array<{ title: string, component: any }>;
  pages2: Array<{ title: string, component: any }>;
  showedAlert: boolean;
  confirmAlert: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public events: Events,
    public menu: MenuController,
    public nativeStorage: NativeStorage,
    public splashScreen: SplashScreen,
    public geolocation: Geolocation,
    public device: Device,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider,
    public fbProvider: FacebookProvider,
    public googleProvider: GoogleProvider,
    private push: Push,
    private alertCtrl: AlertController
  ) {

    // console.log("badge count..............", this.badgeCount);
    // this.badgeCount =  this.userProvider.badge;

    events.subscribe('badge:created', (badge) => {
      // badge  are the same arguments passed in `events.publish(badge)`
      console.log('Welcome...........................................', badge);
      this.badgeCount = badge;
    });

    document.addEventListener('pause', () => {
      // alert(1)

    })
    this.initializeApp();
    document.addEventListener('resume', () => {
      let notificationOpenedCallback = (jsonData) => {
        console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
      }
      // //  alert("gsdgf");
      // // this.rootPage = InitialPage;
      // this.nativeStorage.getItem('notification').then((data) => {
      //   console.log(data);
      //   let splitData = data.split(",");
      //   let orderId = splitData[0];
      //   let userType = splitData[1];
      //   console.log(orderId);
      //   console.log(userType);
      //   if (orderId != "") {
      //     if (userType == 1) {
      //       this.menu.enable(true, "customer");
      //       this.rootPage = CustomerOrderDetailsPage;
      //     }
      //     if (userType == 2) {
      //       this.menu.enable(true, "service");
      //       this.rootPage = ServiceOrderDetailPage;
      //     }
      //   }
      //   //   this.nativeStorage.remove('notification');
      // }, error => console.error(error)
      // );
    });
    // used for an example of ngFor and navigation
    this.pages1 = [
      { title: 'Home', component: CustomerHomePage },
      { title: 'Profile', component: CustomerProfilePage },
      { title: 'Order List', component: CustomerOrderListPage },
      { title: 'Running Order List', component: CustomerOrderRunningListPage },
      { title: 'Order History', component: CustomerOrderHistoryPage },
      { title: 'Notifications', component: CustomerNotificationsPage },
      // { title: 'Bank Details', component: CustomerBankDetailsPage }, 
      { title: 'Settings', component: CustomerSettingsPage },
      { title: 'Login as Service Provider', component: null },
      { title: 'Logout', component: null }
    ];

    this.pages2 = [
      { title: 'Home', component: ServiceHomePage },
      { title: 'Profile', component: ServiceProfilePage },
      { title: 'Order List', component: ServiceOrderListPage },
      { title: 'Order Accepted', component: ServiceAcceptedOrdersPage },
      { title: 'Order History', component: ServiceOrderHistoryPage },
      { title: 'Notifications', component: ServiceNotificationsPage },
      /*{ title: 'Order Map', component: ServiceOrderMapPage },*/
      { title: 'Settings', component: ServicesSettingsPage },
      { title: 'Login as Customer', component: null },
      { title: 'Logout', component: null }
    ];

  }

  initializeApp() {
    console.log("initializeApp");

    this.platform.ready().then(() => {

      console.log("this.platform.ready");

      var check = true;
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.userProvider.deviceUuid = this.device.uuid;
      this.utilsProvider.watchPosition();

      this.userProvider.getToken().then(data => {
        console.log("get token..", data);
        this.userProvider.token = data;
        this.userProvider.getCategories().then(data => {
          this.userProvider.getUser().then(user => {
            this.userProvider.user = user;
            this.userProvider.getUserType().then(userType => {
              if (userType == 'customer')
                this.userProvider.userType = 1;
              else if (userType == 'service')
                this.userProvider.userType = 2;
              if (this.userProvider.user.dob == null && this.userProvider.userType == 1)
                this.rootPage = CustomerProfilePage;
              else if (this.userProvider.user.dob == null && this.userProvider.userType == 2)
                this.rootPage = ServiceProfilePage;
              else if (this.userProvider.user.dob != null && this.userProvider.userType == 1)
                this.rootPage = CustomerHomePage;
              else if (this.userProvider.user.dob != null && this.userProvider.userType == 2)
                this.rootPage = ServiceHomePage;
            });
          });

        }, err => {
          console.log("getCategories err");
          this.rootPage = InitialPage;
          this.nativeStorage.clear();
        })
      }, (error) => {
        console.log("get token....", error);
        this.rootPage = InitialPage;
        this.nativeStorage.clear();
      });

      this.showedAlert = false;
      // Confirm exit
      this.platform.registerBackButtonAction(() => {
        if (this.menu.isOpen())
          this.menu.close()
        else if (this.nav.canGoBack())
          this.nav.pop();
        else if (this.nav.length() == 1) {
          if (!this.showedAlert)
            this.confirmExitApp();
          else {
            this.showedAlert = false;
            this.confirmAlert.dismiss();
          }
        }
      });
    });
  }

  confirmExitApp() {
    console.log('confirmExitApp');
    this.showedAlert = true;
    this.confirmAlert = this.alertCtrl.create({
      title: "Confirm",
      message: "Do you want to exit the app?",
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel');
            this.showedAlert = false;
            return;
          }
        },
        {
          text: 'exit?',
          handler: () => {
            console.log('exit?');
            this.platform.exitApp();
          }
        }
      ]
    });
    this.confirmAlert.present();
  }

  getFirebaseId(_id, userType) {

    this.userProvider.getFirebaseId('firebaseid', this.userProvider.user.id, this.userProvider.userType).then(data => {

      console.log("this.userProvider.addUserMeta success");
      console.log("firebase ids.....................................................", data);

      var d = JSON.parse(JSON.stringify(data));
      if (d.length != 0) {

      } else {
        this.saveFirebaseId(this.userProvider.firebaseRegId, userType);
      }
    }, err => {
      console.log("addUserMeta err")
      console.log(err)

    })
  }

  saveFirebaseId(_id, userType) {
    this.userProvider.addFirebaseId('firebaseid', _id, userType).then(data => {
      console.log("this.userProvider.addUserMeta success");
      console.log(data);
    }, err => {
      console.log("addUserMeta err")
      console.log(err)

    })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    if (page.component) {
      this.nav.setRoot(page.component);
    } else {
      if (page.title.startsWith("Login as ")) {
        this.badgeCount = 0;
        if (this.userProvider.user.user_type != 3) {
          this.userProvider.changeUserType().then(data => {
            this.userProvider.user.user_type = 3;
            this.userProvider.setUser(this.userProvider.user);
            if (this.userProvider.userType == 1) {
              this.userProvider.setUserType('service');
              this.rootPage = ServiceHomePage;
              this.getFirebaseId(this.userProvider.user.id, this.userProvider.userType);
            }
            else if (this.userProvider.userType == 2) {
              this.userProvider.setUserType('customer');
              this.rootPage = CustomerHomePage;
              this.getFirebaseId(this.userProvider.user.id, this.userProvider.userType);
            }
          }, err => {
            console.log("this.userProvider.changeUserType err")
            console.log(err)
          })
        }
        else {
          if (this.userProvider.userType == 1) {
            this.userProvider.setUserType('service');
            this.rootPage = ServiceHomePage;
            this.getFirebaseId(this.userProvider.user.id, this.userProvider.userType);

          }
          else if (this.userProvider.userType == 2) {
            this.userProvider.setUserType('customer');
            this.rootPage = CustomerHomePage;
            this.getFirebaseId(this.userProvider.user.id, this.userProvider.userType);
          }
        }
      }
      else {
        this.userProvider.logout();
        this.menu.enable(false);
        this.userProvider.getLoginType().then(loginType => {
          switch (loginType) {
            case 2:
              this.fbProvider.doFacebookLogout();
              break;
            case 3:
              this.googleProvider.doGoogleLogout();
              break;
          }
        }).then(data => {
          this.nativeStorage.clear();
          this.nav.setRoot(InitialPage);
        })
      }
    }
  }

}
