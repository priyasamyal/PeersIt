import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController,LoadingController } from 'ionic-angular';

import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { AlertProvider } from '../../providers/alert/alert';
import { UtilsProvider } from '../../providers/utils/utils';

import { ServiceOrderHistoryModel } from './service-order-history.model';

import { ServiceOrderDetailPage } from '../service-order-detail/service-order-detail';
import { ServiceOrderHistoryFilterPage } from '../service-order-history-filter/service-order-history-filter';

/**
 * Generated class for the ServiceOrderHistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-order-history',
  templateUrl: 'service-order-history.html',
})
export class ServiceOrderHistoryPage {

  serviceOrderHistory: ServiceOrderHistoryModel = new ServiceOrderHistoryModel();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public orderProvider: OrderProvider,
    public userProvider: UserProvider,
    public loadingCtrl: LoadingController,
    public alert: AlertProvider,
    public utilsProvider: UtilsProvider,
    public popoverCtrl: PopoverController
  ) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceOrderHistoryPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerOrderListPage');
    this.getOrderHistory();
  }

  // Used to get history of the orders
  getOrderHistory() {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader create
    loading.present(); // loading present
    this.orderProvider.getServiceOrderHistoryAccepted(1, this.serviceOrderHistory.sort_type, this.serviceOrderHistory.sort_column).then(data => {
      loading.dismiss(); // loading dismiss
      console.log("this.orderProvider.getServiceOrderHistory success");
      console.log(data);
      this.serviceOrderHistory.orders = this.utilsProvider.prepareOrderDetails(data)
    }, err => {
      loading.dismiss(); //loading dismiss
      console.log("getServiceOrderHistory err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  // order details page
  orderDetail(obj) {
    this.navCtrl.push(ServiceOrderDetailPage, { 'orderDetail': obj, 'status': 2 });
  }

  presentRadioPopover(ev: UIEvent) {
    let popover = this.popoverCtrl.create(ServiceOrderHistoryFilterPage, {'filter': this.serviceOrderHistory.sort_column, 'sort_type': this.serviceOrderHistory.sort_type});
    popover.present({
      ev: ev
    });
    popover.onDidDismiss((popoverData) => {
      this.serviceOrderHistory.sort_column = popoverData.filter;
      this.serviceOrderHistory.sort_type = popoverData.sort_type;
      this.getOrderHistory();
    })
  }
}
