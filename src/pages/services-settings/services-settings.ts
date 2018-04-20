import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Range } from 'ionic-angular';

import { AlertProvider } from '../../providers/alert/alert';
import { UserProvider } from '../../providers/user/user';
/**
 * Generated class for the ServicesSettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-services-settings',
  templateUrl: 'services-settings.html',
})
export class ServicesSettingsPage {
  secretCode: string;
  age: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alert: AlertProvider,
    public userProvider: UserProvider
  ) {
    this.secretCode = this.userProvider.secretCode;
    this.age = {lower: this.userProvider.settings.service_age_lower, upper: this.userProvider.settings.service_age_upper};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesSettingsPage');
  }

  /* toggle functions */

//used to change settings of servicde provider
  chnageSetting(type, value) {
    console.log("chnageSetting");
    switch (type) {
      case 'demand':
        this.userProvider.setUserSettings("service_on_demand_orders", this.userProvider.settings.service_on_demand_orders ? "1" : "0")
        break;
      case 'resting':
        this.userProvider.setUserSettings("service_resting_orders", this.userProvider.settings.service_resting_orders ? "1" : "0")
        break;
      case 'push':
        this.userProvider.setUserSettings("service_push_notifications", this.userProvider.settings.service_push_notifications ? "1" : "0")
        break;
      case 'mute':
        this.userProvider.setUserSettings("service_mute", this.userProvider.settings.service_mute ? "1" : "0")
        break;
      case 'acceptingOrders':
        this.userProvider.setUserSettings("service_accepting_orders", this.userProvider.settings.service_accepting_orders ? "1" : "0")
        break;
      case 'orderType':
        this.userProvider.setUserSettings("service_order_type", this.userProvider.settings.service_order_type)
        break;
      case 'deliveryRaduis':
        this.userProvider.setUserSettings("service_delivery_raduis", this.userProvider.settings.service_delivery_raduis)
        break;
      case 'preferredLocation':
        this.userProvider.setUserSettings("service_provide_from", this.userProvider.settings.service_provide_from)
        break;
      case 'orderGender':
        this.userProvider.setUserSettings("service_order_gender", this.userProvider.settings.service_order_gender)
        break;
      case 'messages':
        this.userProvider.setUserSettings("service_order_mode", this.userProvider.settings.service_order_mode)
        break;
      case 'window_start':
        this.userProvider.setUserSettings("service_order_window_start", this.userProvider.settings.service_order_window_start)
        break;
      case 'window_end':
        this.userProvider.setUserSettings("service_order_window_end", this.userProvider.settings.service_order_window_end)
        break;
      case 'cap':
        this.userProvider.setUserSettings("service_cap", this.userProvider.settings.service_cap)
        break;
      case 'cap_amount':
        this.userProvider.setUserSettings("service_cap_amount", this.userProvider.settings.service_cap_amount)
        break;
      case 'cap_day':
        this.userProvider.setUserSettings("service_cap_day", this.userProvider.settings.service_cap_day)
        break;
      case 'atm':
        this.userProvider.setUserSettings("service_is_atm", this.userProvider.settings.service_is_atm)
        break;
      case 'min_atm':
        this.userProvider.setUserSettings("service_min_atm", this.userProvider.settings.service_min_atm)
        break;
      case 'max_atm':
        this.userProvider.setUserSettings("service_max_atm", this.userProvider.settings.service_max_atm)
        break;
      case 'is_age':
        this.userProvider.setUserSettings("service_is_age", this.userProvider.settings.service_is_age)
        break;
    }
  }

// Used to set secret code
  saveSecretCode(){
    this.userProvider.addUserMeta('secret_code', this.secretCode).then(data => {
      console.log("this.userProvider.addUserMeta success");
      console.log(data);
      this.userProvider.secretCode = this.secretCode;
      this.alert.okAlertMsg("Secret Supplier code added successfully");
    }, err => {
      console.log("addUserMeta err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  ageRangeChange(range: Range) {
    console.log('rangeChange');
    console.log(range);
    this.userProvider.settings.service_age_lower = range._value.lower; 
    this.userProvider.settings.service_age_upper = range._value.upper;
    this.userProvider.setUserSettings("service_age_lower", this.userProvider.settings.service_age_lower);
    this.userProvider.setUserSettings("service_age_upper", this.userProvider.settings.service_age_upper);
  }
}
