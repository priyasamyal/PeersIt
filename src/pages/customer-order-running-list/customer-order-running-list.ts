import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController, NavParams, LoadingController } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert/alert';
import { UtilsProvider } from '../../providers/utils/utils';
import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { CustomerRunningOrderModel } from './costumer-running-order-model';
import { CustomerEditOrderPage } from '../customer-edit-order/customer-edit-order';
/**
 * Generated class for the CustomerOrderRunningListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer-order-running-list',
  templateUrl: 'customer-order-running-list.html',
})
export class CustomerOrderRunningListPage {
  CustomerOrderRunningList: CustomerRunningOrderModel = new CustomerRunningOrderModel();
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public orderProvider: OrderProvider,
    public userProvider: UserProvider,
    public alert: AlertProvider,
    public utilsProvider: UtilsProvider,
    private loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController
  ) {
    this.Running_order_list();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerOrderRunningListPage');
  }


  Running_order_list() {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader create
    loading.present(); //loading present
    this.orderProvider.getCustomerOrderList(5, this.CustomerOrderRunningList.sort_type, this.CustomerOrderRunningList.sort_column).then(data => {
      console.log("this.orderProvider.getCustomerOrderList success");
      loading.dismiss(); // loading dismiss
      console.log("orders.............", data);
      this.CustomerOrderRunningList.orders = this.utilsProvider.prepareOrderDetails(data);
    }, err => {
      console.log("getCustomeRunningOrderList err")
      loading.dismiss(); // loading dismiss
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  // Used to send the order_id to customer edit page
  OrderEditDetail(orderId) {
    console.log(orderId);
    this.navCtrl.push(CustomerEditOrderPage, { 'orderId': orderId, 'status': 1});
  }

//used to cancel orders
OrderCancel(orderId){
    let loading = this.loadingCtrl.create({content:'Please Wait...'}); // loader create
    loading.present(); // loading present
    this.orderProvider.permanentDeleteOrder(orderId).then(data => {
      loading.dismiss(); // loading dismiss
      console.log("this.orderProvider.permanentDeleteOrder success");
      console.log(data);
      this.CustomerOrderRunningList.orders = this.CustomerOrderRunningList.orders.filter(function (order) {
        return order.id != orderId;
      });
      this.alert.okAlertMsg("Order Deleted Successfully");
    }, err => {
      loading.dismiss(); // loading dismiss
      console.log("acceptServiceOrder err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

}
