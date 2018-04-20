import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ServiceOrderHistoryFilterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-order-history-filter',
  templateUrl: 'service-order-history-filter.html',
})
export class ServiceOrderHistoryFilterPage {
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
    console.log('ionViewDidLoad ServiceOrderHistoryFilterPage');
  }

  setFilter() {
    this.viewCtrl.dismiss({'filter': this.filter, 'sort_type': this.sort_type});
  }
}
