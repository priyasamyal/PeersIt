import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AlertProvider } from '../../providers/alert/alert';
import { UserProvider } from '../../providers/user/user';


import { CustomerSecretCodeListPage } from '../customer-secret-code-list/customer-secret-code-list';

/**
 * Generated class for the CustomerSettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer-settings',
  templateUrl: 'customer-settings.html',
})
export class CustomerSettingsPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alert: AlertProvider,
    public userProvider: UserProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerSettingsPage');
  }

  /* order relaese  time span */
  showInfo() {
    this.alert.okAlertMsg("Time within which if order is not taken by your filtered group, the order will be released to anyone!");
  }

  /* toggle functions */
// Used for opening the settings page
  chnageSetting(type) {
    console.log("chnageSetting");
    switch (type) {
      case 'push':
        this.userProvider.setUserSettings("consumer_push_notifications", this.userProvider.settings.consumer_push_notifications ? "1" : "0")
        break;
      case 'orderType':
        this.userProvider.setUserSettings("consumer_order_type", this.userProvider.settings.consumer_order_type)
        break;
      case 'preferredOrders':
        this.userProvider.setUserSettings("consumer_preferred_orders", this.userProvider.settings.consumer_preferred_orders)
        break;
      case 'orderTime':
        this.userProvider.setUserSettings("consumer_order_time", this.userProvider.settings.consumer_order_time)
        break;
      case 'contactPriority':
        this.userProvider.setUserSettings("consumer_contact_priority", this.userProvider.settings.consumer_contact_priority)
        break;
      case 'messages':
        this.userProvider.setUserSettings("consumer_order_mode", this.userProvider.settings.consumer_order_mode)
        break;
    }
  }

//Used for adding the secret codes
  addSecretCode(){
    this.navCtrl.setRoot(CustomerSecretCodeListPage);
  }
}
