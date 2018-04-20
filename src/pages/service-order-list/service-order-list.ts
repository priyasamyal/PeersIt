import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { AlertProvider } from '../../providers/alert/alert';
import { UtilsProvider } from '../../providers/utils/utils';
import { ServiceOrderFilterPage } from '../service-order-filter/service-order-filter';
import { ServiceOrderDetailPage } from '../service-order-detail/service-order-detail';
import { ServiceOrderListModel } from './service-order-list.model';

import { MapProvider } from '../../providers/map/map';
import { MapsModel, MapPlace } from '../../providers/map/maps.model';


import { GoogleMap } from "../../components/google-map/google-map";



/**
 * Generated class for the ServiceOrderListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-order-list',
  templateUrl: 'service-order-list.html',
})
export class ServiceOrderListPage {

  @ViewChild(GoogleMap) _GoogleMap: GoogleMap;
  map_model: MapsModel = new MapsModel();

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  segment: string;
  loading: any;

  serviceOrderList: ServiceOrderListModel = new ServiceOrderListModel();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modal: ModalController,
    public geolocation: Geolocation,
    public popoverCtrl: PopoverController,
    public orderProvider: OrderProvider,
    public userProvider: UserProvider,
    public loadingCtrl: LoadingController,
    public alert: AlertProvider,
    public utilsProvider: UtilsProvider,
  ) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceOrderListPage');
  }


  ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerOrderListPage');
    this.getOrders();
  }

  // show filter popover 
  presentRadioPopover(ev: UIEvent) { 
    this.popoverCtrl.create(ServiceOrderFilterPage).present({
      ev: ev
    });
  }

 // accept orders
  OrderStatus(order_id, action) {
    this.orderProvider.acceptServiceOrder({ supplier_id: this.userProvider.user.id, order_id: order_id, token: this.userProvider.token, action: action }).then(data => {
      console.log("this.orderProvider.acceptServiceOrder success");
      console.log(data);
      this.serviceOrderList.orders = this.serviceOrderList.orders.filter(function (order) {
        return order.id != order_id;
      });
      if (action == 1)
        this.alert.okAlertMsg("Order Accepted Successfully");
    }, err => {
      console.log("acceptServiceOrder err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

 // order details page
  orderDetail(obj) {
    this.navCtrl.push(ServiceOrderDetailPage, { 'orderDetail': obj, 'status': 0 });
  }

  showFilter() {
    let modal = this.modal.create(ServiceOrderFilterPage);
    modal.onDidDismiss(data => {
      this.getOrders();
    });
    modal.present();
  }

// get order list
  getOrders() { 
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader
    loading.present(); //loading present
    this.orderProvider.getAllServiceOrders(Object.assign({}, this.userProvider.orderFilter)).then(data => {
      console.log("this.orderProvider.getAllServiceOrders success");
      loading.dismiss(); //loading dismiss
      console.log(data);
      this.serviceOrderList.orders = this.utilsProvider.prepareOrderDetails(data);
    }, err => {
      console.log("getAllServiceOrders err")
      loading.dismiss(); //loading dismiss
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    });
  }
}


