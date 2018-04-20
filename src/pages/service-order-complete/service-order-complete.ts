import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { ServiceHomePage } from '../service-home/service-home';

import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { AlertProvider } from '../../providers/alert/alert';

/**
 * Generated class for the ServiceOrderCompletePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-order-complete',
  templateUrl: 'service-order-complete.html',
})
export class ServiceOrderCompletePage {
  completeForm: FormGroup;
  showAmount: boolean = false;
  totalCost: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public orderProvider: OrderProvider,
    private loadingCtrl: LoadingController,
    public alert: AlertProvider
  ) {
    this.completeForm = new FormGroup({
      receipt_code: new FormControl('', Validators.required)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceOrderCompletePage');
  }

// Used to enter receipt code 
  enterReceiptCode() {
    console.log("enterReceiptCode");
    if(this.navParams.get("receiptCode") == this.completeForm.value.receipt_code)
      this.showAmount = true;
    else
      this.alert.okAlertMsg("This Receipt Code is not valid")
  }

// Used to enter the total amount of order 
  enterTotalCost() {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); //loader
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
    })
  }

}
