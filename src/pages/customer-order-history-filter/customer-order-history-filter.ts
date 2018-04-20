import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CustomerOrderHistoryFilterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer-order-history-filter',
  templateUrl: 'customer-order-history-filter.html',
})
export class CustomerOrderHistoryFilterPage {
  filter: string;
  sort_type: string;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.filter = this.navParams.get('filter');
    this.sort_type = this.navParams.get('sort_type');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerOrderHistoryFilterPage');
  }

  setFilter() {
    this.viewCtrl.dismiss({'filter': this.filter, 'sort_type': this.sort_type});
  }
}
