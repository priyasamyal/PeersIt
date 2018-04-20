import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { NativeStorage } from '@ionic-native/native-storage';

import moment from 'moment';

import { Api } from '../../providers/api/api';
import { AlertProvider } from '../../providers/alert/alert';
import { UserProvider } from '../../providers/user/user';

import { OrderProvider } from '../../providers/order/order';

import { UtilsProvider } from '../../providers/utils/utils';

import { CustomerHumanAtmEditPage } from '../customer-human-atm-edit/customer-human-atm-edit';
import { CustomerEditOrderPage } from '../customer-edit-order/customer-edit-order';
import { CustomerChatViewPage } from '../customer-chat-view/customer-chat-view';
import { CustomerOrderInvoicePage } from '../customer-order-invoice/customer-order-invoice';
/**
 * Generated class for the CustomerOrderDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer-order-details',
  templateUrl: 'customer-order-details.html',
})
export class CustomerOrderDetailsPage {
  detail: any;
  status: number;
  //  showEditOrder: boolean = true;
  //  showPayment: boolean = false;
  orderMeta: any = {};
  totalCost: any;
  customerOrderCostId: number = 0;

  senderId: any;
  recieverId: any;
  firebaseSenderId: any;
  firebaseRecieverId: any;
  reciverUserType: any;
  showDetail: boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public alert: AlertProvider,
    private callNumber: CallNumber,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider,
    public orderProvider: OrderProvider,
    public nativeStorage: NativeStorage
  ) {
    if (this.showDetail) {
      this.detail = this.navParams.get('orderDetail');
      this.status = this.navParams.get('status');
      console.log(this.status);
      console.log(this.detail);
      console.log(this.status);
      console.log(this.detail.pickupLocation);

      if (this.status == 1)
        this.getOrderMeta();
    }
  }


  getOrderDetail(_id) {
    this.orderProvider.getOrderDetails(_id).then(data => {
      console.log("get order detail");
      console.log(data);
      this.detail = this.utilsProvider.prepareOrderDetails(data);
    }, err => {
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerOrderDetailsPage');
  }

  ionViewWillEnter() {
    if (this.userProvider.userType == 1) {
      this.senderId = this.detail.consumer_id;
      this.userProvider.getFirebaseId('firebaseid', this.senderId, 1).then(data => {
        console.log(data);
        this.firebaseSenderId = data[0].meta_value;
        console.log("firebase sender id", this.firebaseSenderId);
      })

      this.recieverId = this.detail.supplier_id;
      this.reciverUserType = 2;
      this.userProvider.getFirebaseId('firebaseid', this.recieverId, 2).then(data => {
        console.log(data);
        this.firebaseRecieverId = data[0].meta_value;
        console.log("firebase reciever id", this.firebaseRecieverId);
      });

    } else {
      this.senderId = this.detail.supplier_id;
      this.userProvider.getFirebaseId('firebaseid', this.senderId, 2).then(data => {
        console.log(data);
        this.firebaseSenderId = data[0].meta_value;
        console.log("firebase sender id", this.firebaseSenderId);
      })
      this.reciverUserType = 1;
      this.recieverId = this.detail.consumer_id;
      this.userProvider.getFirebaseId('firebaseid', this.recieverId, 1).then(data => {
        console.log(data);
        this.firebaseRecieverId = data[0].meta_value;
        console.log("firebase reciever id", this.firebaseRecieverId);
      });

    }
  }

  // used to navigate to customer edit order page 
  editOrders(categoryId) {
    if (categoryId == 1)
      this.navCtrl.push(CustomerHumanAtmEditPage, { 'orderId': this.detail.id });
    else
      this.navCtrl.push(CustomerEditOrderPage, { 'orderId': this.detail.id });
  }

  getOrderMeta() {
    console.log("getOrderMeta");
    var orderMeta = {
      order_id: this.detail.id,
      token: this.userProvider.token
    }
    console.log(orderMeta);
    this.orderProvider.getOrderMeta(orderMeta).then(data => {
      console.log(data);
      for (let d of JSON.parse(JSON.stringify(data))) {
        this.orderMeta[d.meta_name] = d.meta_value;
        if (d.meta_name == "customer_order_cost") {
          this.customerOrderCostId = d.id;
          //          this.totalCost = d.meta_value;
        }
      }
    }, err => {
      console.log(err);
    });
  }

  //used to call form the app
  call() {
    this.callNumber.callNumber(this.detail.mobile_no, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  //used to send parameters like uid and interlocutor to customer chat view page 
  message() {
    let param = { uid: this.firebaseSenderId, interlocutor: this.firebaseRecieverId, recieverId: this.recieverId, orderDetail: this.detail, reciverUserType: this.reciverUserType };
    this.navCtrl.push(CustomerChatViewPage, { params: param });
  }

  showImage() {
    for (let item of this.detail.subject) {
      if (item.image)
        return true;
    };
    return false;
  }

  // Used to enter the total amount of order 
  enterTotalCost() {
    console.log("enterTotalCost");
    var orderMeta = {
      order_id: this.detail.id,
      token: this.userProvider.token
    }
    console.log(orderMeta);
    this.orderProvider.getOrderMeta(orderMeta).then(data => {
      console.log(data);
      for (let d of JSON.parse(JSON.stringify(data))) {
        this.orderMeta[d.meta_name] = d.meta_value;
        if (d.meta_name == "customer_order_cost")
          this.customerOrderCostId = d.id;
      }
      if (this.orderMeta.service_order_cost)
        if (this.orderMeta.service_order_cost == this.totalCost) {
          let oM = {
            meta_name: "customer_order_cost",
            meta_value: this.totalCost,
            token: this.userProvider.token
          }
          if (this.orderMeta.customer_order_cost) {
            oM["ordermeta_id"] = this.customerOrderCostId;
            this.orderProvider.updateOrderMeta(oM).then(data => {
              this.orderMeta.customer_order_cost = this.totalCost;
              //              this.showPayment = true;
              this.customerOrderCostId = -1;
              this.alert.okAlertMsg("Click Make Payment to see invoice.")
            })
          }
          else {
            oM["order_id"] = this.detail.id;
            this.orderProvider.addOrderMeta(oM).then(data => {
              this.orderMeta.customer_order_cost = this.totalCost;
              //              this.showPayment = true;
              this.customerOrderCostId = -1;
              this.alert.okAlertMsg("Click Make Payment to see invoice.")
            })
          }
        }
        else
          this.alert.okAlertMsg("Please enter the same amount as Service provider.")
      else
        this.alert.okAlertMsg("Please ask the Service provider to enter the amount first.")
    }, err => {
      console.log(err);
    });
  }

  makePayment() {
    console.log("makePayment");
    //    x.results[0].address_components.filter(g => { return g.long_name.includes("County")})

    if (this.orderMeta.total_fee)
      this.navCtrl.setRoot(CustomerOrderInvoicePage, { orderId: this.detail.id });
    else if (this.orderMeta.service_order_cost == this.orderMeta.customer_order_cost) {
      var orderEndTime = moment(new Date().toISOString()).locale('es').format();
      var orderEndLatLong = this.userProvider.currentLocation.lat + ',' + this.userProvider.currentLocation.lng;
      this.orderProvider.addOrderMeta({
        order_id: this.detail.id,
        meta_name: "order_end_time",
        meta_value: orderEndTime,
        token: this.userProvider.token
      }).then(data => {
        this.orderMeta.order_end_time = orderEndTime;
      })

      this.orderProvider.addOrderMeta({
        order_id: this.detail.id,
        meta_name: "order_end_lat_long",
        meta_value: orderEndLatLong,
        token: this.userProvider.token
      }).then(data => {
        this.orderMeta.order_end_lat_long = orderEndLatLong;
      });

      this.utilsProvider.getCountyName(this.userProvider.currentLocation.lat, this.userProvider.currentLocation.lng).then(countyName => {

        let lat1 = orderEndLatLong.split(",")[0];
        let lng1 = orderEndLatLong.split(",")[1];
        let lat2 = this.orderMeta.order_start_lat_long.split(",")[0];
        let lng2 = this.orderMeta.order_start_lat_long.split(",")[1];

        this.utilsProvider.getDistance(lat1, lng1, lat2, lng2).then(data => {
          var orderAmount = {
            order_id: this.detail.id,
            order_cost: this.orderMeta.service_order_cost,
            time_required: this.utilsProvider.getTimeDiffernce(this.orderMeta.order_start_time, orderEndTime),
            distance: data,
            county: countyName,
            coupon_code: this.detail.couponCode,
            item_numbers: this.detail.subject.length,
            token: this.userProvider.token
          }
          this.orderProvider.getOrderAmount(orderAmount).then(data => {
            console.log("this.orderProvider.getOrderAmount")
            console.log(data);
            this.navCtrl.setRoot(CustomerOrderInvoicePage, { orderId: this.detail.id });
          }, err => {
            this.alert.okAlertTitleMsg('Error', err);
          })
        })
      });
    }
    else
      this.alert.okAlertMsg('Please enter the same price as Service Provider');
  }

}
