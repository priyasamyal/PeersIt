import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController,LoadingController } from 'ionic-angular';

import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { AlertProvider } from '../../providers/alert/alert';
import { UtilsProvider } from '../../providers/utils/utils';

import { CustomerOrderDetailsPage } from '../customer-order-details/customer-order-details';
import { CustomerOrderHistoryFilterPage } from '../customer-order-history-filter/customer-order-history-filter';

import { CustomerOrderHistoryModel } from './costumer-order-history.model';

/**
 * Generated class for the CustomerOrderHistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer-order-history',
  templateUrl: 'customer-order-history.html',
})
export class CustomerOrderHistoryPage {

  customerOrderHistory: CustomerOrderHistoryModel = new CustomerOrderHistoryModel();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public orderProvider: OrderProvider,
    public userProvider: UserProvider,
    public alert: AlertProvider,
    public utilsProvider: UtilsProvider,
    private loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerOrderHistoryPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerOrderListPage');
    this.getOrderHistory();

  }
  //Used to get the history of orders
  getOrderHistory() {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader create
    loading.present(); //loading present
    this.orderProvider.getCustomerOrderList(1, this.customerOrderHistory.sort_type, this.customerOrderHistory.sort_column).then(data => {
      console.log("this.orderProvider.getCustomerOrderList success");
      loading.dismiss(); // loading dismiss
      console.log("orders.............", data);
      this.customerOrderHistory.orders = this.utilsProvider.prepareOrderDetails(data);
    }, err => {
      console.log("getCustomerOrderList err")
      loading.dismiss(); // loading dismiss
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  // order details page
  gotToDetail(obj) {
    this.navCtrl.push(CustomerOrderDetailsPage, { 'orderDetail': obj, status: 2 });
  }

  presentRadioPopover(ev: UIEvent) {
    let popover = this.popoverCtrl.create(CustomerOrderHistoryFilterPage, {'filter': this.customerOrderHistory.sort_column, 'sort_type': this.customerOrderHistory.sort_type});
    popover.present({
      ev: ev
    });
    popover.onDidDismiss((popoverData) => {
      this.customerOrderHistory.sort_column = popoverData.filter;
      this.customerOrderHistory.sort_type = popoverData.sort_type;
      this.getOrderHistory();
    })
  }

}
