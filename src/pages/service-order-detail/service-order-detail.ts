import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { NativeStorage } from '@ionic-native/native-storage';

import { ServiceHomePage } from '../service-home/service-home';
import { ServiceOrderListPage } from '../service-order-list/service-order-list';
import { ServiceOrderCompletePage } from '../service-order-complete/service-order-complete';
import { CustomerChatViewPage } from '../customer-chat-view/customer-chat-view';

import { GoogleMap } from "../../components/google-map/google-map";

import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { AlertProvider } from '../../providers/alert/alert';
import { MapProvider } from '../../providers/map/map';
import { UtilsProvider } from '../../providers/utils/utils';
import { MapsModel, MapPlace } from '../../providers/map/maps.model';
import { Api } from '../../providers/api/api';

import moment from 'moment';

/**
 * Generated class for the ServiceOrderDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-order-detail',
  templateUrl: 'service-order-detail.html',
})
export class ServiceOrderDetailPage {
  //  @ViewChild(GoogleMap) _GoogleMap: GoogleMap;
  //  map_model: MapsModel = new MapsModel();

  //  @ViewChild('map') mapElement: ElementRef;
  //  map: any;
  //  supplierLat: any;
  //  radius = 5;
  //  category: any;
  //  filter: any;
  detail: any;
  status: any;
  showStartOrder: boolean = false;
  showReceiptCode: boolean = false;
  showAmount: boolean = false;
  receiptCode: number;
  totalCost: any;
  customerOrderCost: any;
  serviceOrderCost: any;
  senderId: any;
  recieverId: any;
  firebaseSenderId: any;
  firebaseRecieverId: any;
  reciverUserType: any;
  showDetail: boolean = true;
  intervalD:any;
  latLong:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private callNumber: CallNumber,
    public orderProvider: OrderProvider,
    public userProvider: UserProvider,
    public alert: AlertProvider,
    public mapProvider: MapProvider,
    private loadingCtrl: LoadingController,
    public api: Api,
    public nativeStorage: NativeStorage,
    public utilsProvider: UtilsProvider,
  ) {
    //  this.nativeStorage.getItem('notification').then((data) => {
    //   debugger;
    //   console.log(data);
    //   let splitData = data.split(",");
    //   let orderId = splitData[0];
    //   let userType = splitData[1];
    //   console.log(orderId);
    //   console.log(userType);
    //   this.getOrderDetail(orderId);
    //  this.showDetail = false;
    //   this.nativeStorage.remove('notification'); // clear storage
    // }, error => {
    //   console.error(error);
    // this.showDetail = true;
    // }
    // );
    if (this.showDetail) {
      this.detail = this.navParams.get('orderDetail');
      this.status = this.navParams.get('status');
      console.log("order details",this.detail);
      console.log(this.detail.pickupLocation);

      if (this.status == 1){
        this.getOrderStartTime();
        this.getCustomerTotalCost();
        this.getServiceTotalCost();
        this.latLong =  this.userProvider.currentLocation;
        console.log("current kat long....",this.latLong);
      }
    }
  }

  getOrderDetail(_id) {
    this.orderProvider.getOrderDetails(_id).then(data => {
      console.log("get order detail");
      console.log(data);
    }, err => {
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConsumerOrderListDetailPage');
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

  // accept orders by service provider
  acceptOrder(order_id) {
    this.orderProvider.acceptServiceOrder({ supplier_id: this.userProvider.user.id, order_id: order_id, token: this.userProvider.token, action: 1 }).then(data => {
      console.log("this.orderProvider.acceptServiceOrder success");
      console.log(data);
      this.alert.okAlertMsg("Order Accepted Successfully");
      this.navCtrl.setRoot(ServiceOrderListPage);
    }, err => {
      console.log("acceptServiceOrder err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  // Used to communicate through calling between customer and service provider for order confirmation or order details
  call() {
    this.callNumber.callNumber(this.detail.mobile_no, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  // Used to enter receipt code 
  /*   enterReceiptCode(receiptCode, orderId) {
      this.navCtrl.push(ServiceOrderCompletePage, { 'receiptCode': receiptCode, 'orderId': orderId });
    }
   */

  enterReceiptCode(receiptCode) {
    console.log("enterReceiptCode");
    if (receiptCode == this.receiptCode){
      this.showReceiptCode = false;
      this.showAmount = true;
    }
    else
      this.alert.okAlertMsg("This Receipt Code is not valid")
  }

  // Used to communicate through messages between customer and service provider
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

  startOrder() {
  let username = this.userProvider.user.first_name + this.userProvider.user.last_name;
   this.utilsProvider.sendOrderStartNotification(this.detail.consumer_id,username);
    this.trackOrder();
    var orderMeta = {
      order_id: this.detail.id,
      meta_name: "order_start_time",
      meta_value: moment(new Date().toISOString()).locale('es').format(),
      token: this.userProvider.token
    }
    this.orderProvider.addOrderMeta(orderMeta).then(data => {
      this.showStartOrder = false;
      this.showReceiptCode = true;
      this.trackOrder();
    })
    this.orderProvider.addOrderMeta({
      order_id: this.detail.id,
      meta_name: "order_start_lat_long",
      meta_value: this.userProvider.currentLocation.lat+','+this.userProvider.currentLocation.lng,
      token: this.userProvider.token
    });
  }

  trackOrder(){
    debugger;
    this.intervalD = setInterval(() => {
       this.utilsProvider.getTime( this.latLong.lat,this.latLong.lng,this.detail.dropoff_lat,this.detail.dropoff_lng).then(data=>{
       console.log("interval res",data);
       if(data<=6){
         let username = this.userProvider.user.first_name + this.userProvider.user.last_name;
         this.utilsProvider.sendPushNotificationForDelivery(this.detail.consumer_id,username,data);
         clearInterval(this.intervalD );
       }
      },(err)=>{ 
       console.log(err)
     })
      }, 1000 * 60 * 1);
   }

  // Used to enter the total amount of order 
  enterTotalCost() {

    /*     let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); //loader
        loading.present(); //loading present
        console.log("enterTotalCost");
        var orderInfo = {
          order_id: this.navParams.get("orderId"),
          total_cost: this.totalCost,
          token: this.userProvider.token
        }
        this.orderProvider.orderComplete(orderInfo).then(data => {
          loading.dismiss(); // loading dismiss
          this.alert.okAlertMsg("Amount Added");
          this.navCtrl.setRoot(ServiceHomePage);
        }, err => {
          console.log("orderComplete err")
          loading.dismiss(); // loading dismiss
          console.log(err)
          this.alert.okAlertTitleMsg("Error", err);
        }) */
    if (this.serviceOrderCost){
      let orderMeta = {
        ordermeta_id: this.serviceOrderCost.id,
        meta_name: "service_order_cost",
        meta_value: this.totalCost,
        token: this.userProvider.token
      }
      this.orderProvider.updateOrderMeta(orderMeta).then(data => {
        this.alert.okAlertMsg("Please ask the Customer to enter the same amount");
        this.getServiceTotalCost();
      })
    }
    else {
      let orderMeta = {
        order_id: this.detail.id,
        meta_name: "service_order_cost",
        meta_value: this.totalCost,
        token: this.userProvider.token
      }
      this.orderProvider.addOrderMeta(orderMeta).then(data => {
        this.alert.okAlertMsg("Please ask the Customer to enter the same amount");
        this.getServiceTotalCost();
      })
    }
  }

  getOrderStartTime() {
    var orderMeta = {
      order_id: this.detail.id,
      meta_name: "order_start_time",
      token: this.userProvider.token
    }
    this.orderProvider.getOrderMeta(orderMeta).then(data => {
      var d = JSON.parse(JSON.stringify(data));
      if (d.length > 0)
        this.showReceiptCode = true;
      else
        this.showStartOrder = true;
    })
  }

  getCustomerTotalCost() {
    var orderMeta = {
      order_id: this.detail.id,
      meta_name: "customer_order_cost",
      token: this.userProvider.token
    }
    this.orderProvider.getOrderMeta(orderMeta).then(data => {
      var d = JSON.parse(JSON.stringify(data))
      if(d.length > 0)
        this.customerOrderCost = d[0];
    })
  }

  getServiceTotalCost() {
    var orderMeta = {
      order_id: this.detail.id,
      meta_name: "service_order_cost",
      token: this.userProvider.token
    }
    this.orderProvider.getOrderMeta(orderMeta).then(data => {
      var d = JSON.parse(JSON.stringify(data))
      if(d.length > 0)
        this.serviceOrderCost = d[0];
    })
  }

}
