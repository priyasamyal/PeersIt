import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, SegmentButton, LoadingController } from 'ionic-angular';

import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
import { AlertProvider } from '../../providers/alert/alert';
import { CustomerOrderListModel } from './customer-order-list.model';
import { CustomerOrderDetailsPage } from '../customer-order-details/customer-order-details';
/**
 * Generated class for the CustomerOrderListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer-order-list',
  templateUrl: 'customer-order-list.html',
})
export class CustomerOrderListPage {

  segment: string;
  customerNewOrder: CustomerOrderListModel = new CustomerOrderListModel();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public orderProvider: OrderProvider,
    public userProvider: UserProvider,
    public alert: AlertProvider,
    public loadingCtrl: LoadingController,
    public utilsProvider: UtilsProvider,
  ) {
    this.segment = "today";

  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerOrderListPage');
    this.getOngoingOrder();
    this.getUpcomingOrder();

  }

  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }

// used to get ongoing orders
  getOngoingOrder(){ 
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader create
    loading.present();// loading present
    this.orderProvider.getCustomerOrderList(3, 0, 'window_start').then(data => {
      loading.dismiss(); // loading dismiss
      console.log("this.orderProvider.getCustomerOrderList success");
      console.log("customer today order.......", data);
      //this.schedule.today = data;
      this.customerNewOrder.todayOrders = this.utilsProvider.prepareOrderDetails(data);
      console.log(this.customerNewOrder.todayOrders);
    }, err => {
      loading.dismiss(); // loading dismiss
      console.log("getCustomerOrderList err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

//used to get pending orders
  getUpcomingOrder(){ 
    this.orderProvider.getCustomerOrderList(2, 0, 'window_start').then( data => {
      console.log("this.orderProvider.getCustomerOrderList success");
      console.log("upcoming data............",data);
     // this.schedule.upcoming = data;
      this.customerNewOrder.upcomingOrders=this.utilsProvider.prepareOrderDetails(data);
      console.log( this.customerNewOrder.upcomingOrders);
    }, err => {
      console.log("getCustomerOrderList err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

// order details page
gotToDetail(obj, status){ 
  this.navCtrl.push(CustomerOrderDetailsPage, {'orderDetail':obj, 'status': status});
}

//used to cancel orders
OrderCancel1(orderId, categoryId){
    let loading = this.loadingCtrl.create({content:'Please Wait...'}); // loader create
    loading.present(); // loading present
    var orderInfo = {
      user_id: this.userProvider.user.id,
      order_id: orderId,
      user_name: this.userProvider.user.first_name + this.userProvider.user.last_name? " " + this.userProvider.user.last_name:"",
      token: this.userProvider.token
    }
    if(categoryId == 1)
      orderInfo["category_name"] = "ATM Cash";
    else if(categoryId == 2)
      orderInfo["category_name"] = "Deliverables";
    this.orderProvider.cancelConsumerOrder(orderId).then(data => {
      loading.dismiss(); // loading dismiss
      console.log("this.userProvider.cancelConsumerOrder success");
      console.log(data);
      this.customerNewOrder.todayOrders = this.customerNewOrder.todayOrders.filter(function (order) {
        return order.id != orderId;
      });
      this.alert.okAlertMsg("Order Cancelled Successfully");
    }, err => {
      loading.dismiss(); // loading dismiss
      console.log("acceptServiceOrder err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  // used to cancel order 
OrderCancel2(order_id){
    let loading = this.loadingCtrl.create({content:'Please Wait...'}); // loader create
    loading.present(); // loading present
    this.orderProvider.deleteOrder(order_id).then(data => {
      loading.dismiss(); // loading dismiss
      console.log("this.userProvider.deleteOrder success");
      console.log(data);
      this.customerNewOrder.upcomingOrders = this.customerNewOrder.upcomingOrders.filter(function (order) {
        return order.id != order_id;
      });
      this.alert.okAlertMsg("Order Cancelled Successfully");
    }, err => {
      loading.dismiss(); // loading dismiss
      console.log("deleteOrder err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }
}
