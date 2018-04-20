import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';

import { CustomerNewOrderPage } from '../customer-new-order/customer-new-order';
import { CustomerHumanAtmPage } from '../../pages/customer-human-atm/customer-human-atm';

import { AlertProvider } from '../../providers/alert/alert';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
/**
 * Generated class for the CustomerHomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer-home',
  templateUrl: 'customer-home.html',
})
export class CustomerHomePage {
  firstRun: boolean = true;
  interval: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuController: MenuController,
    public alert: AlertProvider,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider,
    public loadingCtrl: LoadingController
  ) {
    console.log('CustomerHomePage constructor');
    this.menuController.enable(true, "customer");
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
    loading.present();
    console.log('ionViewDidLoad CustomerHomePage');
    this.getUserSettings();
    this.userProvider.getAddressList();
    loading.dismiss();
    this.interval = setInterval(() => {
      if (this.userProvider.currentLocation.lat != 0 && this.userProvider.currentLocation.lng != 0)
        this.firstRun = false;
      if (!this.firstRun) {
        var latLongInfo = {
          user_id: this.userProvider.user.id,
          lat: this.userProvider.currentLocation.lat,
          lng: this.userProvider.currentLocation.lng,
          token: this.userProvider.token
        }
        this.userProvider.sendLatLong(latLongInfo);
        clearInterval(this.interval);
      }
    }, 100);
  }

  // used to navigate to customer human atm page
  humanAtm() {
    //    this.alert.okAlertMsg("Coming Soon!!!!!");
    this.navCtrl.push(CustomerHumanAtmPage);
  }

  //used to setroot to customer new order page
  deliverable() {
    let loading = this.loadingCtrl.create({ content: 'Please wait...' }); // loader create
    loading.present();// loading present
    this.navCtrl.setRoot(CustomerNewOrderPage);
    loading.dismiss(); //loading dismiss
  }

  // Used to open customer settings page
  getUserSettings() {
    this.userProvider.getUserSettings().then(data => {
      var d = JSON.parse(JSON.stringify(data));
      console.log(d)
      if (!d.length) {
        console.log("getUserSettings if")
        var settings = {};
        if (this.userProvider.userType == 1) {
          this.userProvider.settings = Object.assign({}, this.utilsProvider.customerSettings);
          settings = Object.assign({}, this.utilsProvider.customerSettings);
        }
        else if (this.userProvider.userType == 2) {
          this.userProvider.settings = Object.assign({}, this.utilsProvider.serviceSettings);
          settings = Object.assign({}, this.utilsProvider.serviceSettings);
        }
        settings["user_id"] = this.userProvider.user.id;
        settings["user_type"] = this.userProvider.userType;
        this.userProvider.saveUserSettings(settings).then(data => {
          console.log("this.userProvider.saveUserSettings success");
          console.log(data);
        }, err => {
          console.log("saveUserSettings err")
          console.log(err)
        })
      }

    }, err => {
      console.log("getUserSettings err");
      console.log(err);
    });
  }
}
