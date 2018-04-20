import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Api } from '../../providers/api/api';
import { AlertProvider } from '../../providers/alert/alert';
import { UserProvider } from '../../providers/user/user';

import { OrderProvider } from '../../providers/order/order';
import { UtilsProvider } from '../../providers/utils/utils';

import { CustomerBankDetailsPage } from '../customer-bank-details/customer-bank-details';
import { CustomerPaymentOptionsPage } from '../customer-payment-options/customer-payment-options';
/**
 * Generated class for the CustomerOrderInvoicePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer-order-invoice',
  templateUrl: 'customer-order-invoice.html',
})
export class CustomerOrderInvoicePage {
  orderInvoice: any;
  orderId: any;
  amount: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public alert: AlertProvider,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider,
    public orderProvider: OrderProvider,

  ) {

    this.orderId = this.navParams.get('orderId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerOrderInvoicePage');
  }

  ionViewWillEnter() {
    this.orderInvoice = [];
    this.orderProvider.getOrderInvoice(this.orderId).then(data => {
      console.log("    this.orderProvider.getOrderInvoice(this.orderId).then(data => {");
      console.log(JSON.stringify(data))
      for (var i in data) {
        this.orderInvoice.push({
          key: data[i].calculation_name,
          value: parseFloat("" + Math.round(data[i].meta_value * 100) / 100).toFixed(2)
        });
        if (data[i].calculation_name == "Total Fee")
          this.amount = data[i].meta_value;
      }

      console.log(JSON.stringify(this.orderInvoice));
    }, (err) => {
      console.log(err);
    })
  }

  payNow() {
    this.navCtrl.push(CustomerBankDetailsPage, {type:'invoice',amount:this.amount, orderId:this.orderId }); // only stripe
  // this.navCtrl.push(CustomerPaymentOptionsPage); // stripe & paypal
    /*     this.utilsProvider.stripePay({
          stripetoken: 'tok_1Ak3pEGoXw5hHUjgB1OoZ7g8',
          token: this.userProvider.token,
          amount: this.amount
        }).then(data => {
          console.log(data)
            this.alert.okAlertMsg('transaction Successfull!!');
        }) */
  }
}
