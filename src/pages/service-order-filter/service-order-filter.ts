import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Range } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ServiceOrderFilterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-order-filter',
  templateUrl: 'service-order-filter.html',
})
export class ServiceOrderFilterPage {
  defaultAddress: boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public view: ViewController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceOrderFilterPage');
    if (this.userProvider.defaultAddress.length > 0)
      this.defaultAddress = false;
  }

// Used to dismiss the view controller
  dismiss() {
    this.view.dismiss();
  }
}
