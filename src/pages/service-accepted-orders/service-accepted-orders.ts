import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
import { AlertProvider } from '../../providers/alert/alert';
import { ServiceOrderAcceptedModel } from './service-accepted-orders.model';
import { ServiceOrderDetailPage } from '../service-order-detail/service-order-detail';
/**
 * Generated class for the ServiceAcceptedOrdersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-accepted-orders',
  templateUrl: 'service-accepted-orders.html',
})
export class ServiceAcceptedOrdersPage {
serviceOrderAccepted: ServiceOrderAcceptedModel = new ServiceOrderAcceptedModel();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public orderProvider: OrderProvider,
    public userProvider: UserProvider,
    public alert: AlertProvider,
    public loadingCtrl: LoadingController,
    public utilsProvider: UtilsProvider,
  ) {
    
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceAcceptedOrdersPage');
  }

ionViewDidEnter() {
    console.log('ionViewDidLoad CustomerOrderListPage');
   this.getAccetedOrders();
   
}

// Used to get accepted orders
getAccetedOrders(){
  let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader create
    loading.present(); // loading present
  console.log("getAccetedOrders");
    this.orderProvider.getServiceOrderHistoryAccepted(2, 0, 'window_start').then(data => {
      console.log("this.orderProvider.getServiceOrderHistory success");
      loading.dismiss(); // loading dismiss
      console.log(data);
      this.serviceOrderAccepted.orders=this.utilsProvider.prepareOrderDetails(data)
    }, err => {
      console.log("getServiceOrderHistory err")
      loading.dismiss(); // loading dismiss
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

// order detail page
orderDetail(obj){ 
  this.navCtrl.push(ServiceOrderDetailPage,{'orderDetail': obj,'status': 1});
}
}
