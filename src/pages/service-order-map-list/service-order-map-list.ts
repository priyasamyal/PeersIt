import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { AlertProvider } from '../../providers/alert/alert';

import { ServiceOrderDetailPage } from '../service-order-detail/service-order-detail';
/**
 * Generated class for the ServiceOrderMapListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-order-map-list',
  templateUrl: 'service-order-map-list.html',
})
export class ServiceOrderMapListPage {
 orders:any=[];
  constructor(
  public navCtrl: NavController,
   public navParams: NavParams,
   public orderProvider: OrderProvider,
    public userProvider: UserProvider,
    public alert: AlertProvider,
   ) {
     this.orders=this.navParams.get('orderList');
     console.log("map order list..............", this.orders);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceOrderMapListPage');
  }

// order detail page
orderDetail(obj){ 
  this.navCtrl.push(ServiceOrderDetailPage,{'orderDetail':obj, 'status': 0 });
}

 //used to accept orders
 OrderStatus(order_id, action) {
    this.orderProvider.acceptServiceOrder({ supplier_id: this.userProvider.user.id, order_id: order_id, token: this.userProvider.token, action: action }).then(data => {
      console.log("this.orderProvider.acceptServiceOrder success");
      console.log(data);
      this.orders = this.orders.filter(function (order) {
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

  

}
