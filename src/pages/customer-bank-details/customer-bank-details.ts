import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { Stripe } from '@ionic-native/stripe';

import { CustomerBankPage } from '../customer-bank/customer-bank';
import { CustomerHomePage } from '../customer-home/customer-home';

import { AlertProvider } from '../../providers/alert/alert';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
import { OrderProvider } from '../../providers/order/order';

declare var require;

/**
 * Generated class for the CustomerBankDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer-bank-details',
  templateUrl: 'customer-bank-details.html',
})
export class CustomerBankDetailsPage {
  bankdetails: any = [];
  setDefault: any;
  default: any = [];
  isDefaultAdded: boolean;
  idToCompare: any;
  show: boolean;
  public SECERET_KEY: string = 'secert key 123'
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private payPal: PayPal,
    private stripe: Stripe,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider,
    private loadingCtrl: LoadingController,
    public alert: AlertProvider,
    public orderProvider: OrderProvider,

  ) {
    if (this.navParams.get('type') == 'invoice') {
      this.show = false;
    } else {
      this.show = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerBankDetailsPage');
  }

  ionViewWillEnter() {
    this.getDefaultBank();
    //this.getBankDetails();
  }

  getBankDetails() {
    this.userProvider.getUserMeta('bank_card').then(data => {
      console.log(data);
      this.bankdetails = [];
      // Decrypt card details 
      for (let i in data) {
        var CryptoJS = require("crypto-js");
        var bytes = CryptoJS.AES.decrypt(data[i].meta_value, this.SECERET_KEY);
        var plaintext = bytes.toString(CryptoJS.enc.Utf8);
        console.log('Decrypt card detials', plaintext.toString());
        this.bankdetails.push(JSON.parse(plaintext));
        this.bankdetails[i]["bankId"] = data[i].id;
      }
      console.log(this.bankdetails);
      if (this.bankdetails.length == 1) { // if single card
        if (!this.isDefaultAdded) {
          this.bankdetails[0].setDefault = 1;
          // this.bankdetails[0].defaultId =   this.default[0].id;
          this.userProvider.addUserMeta('bank_default', this.bankdetails[0]["bankId"]).then(data => {
            console.log(data)
          }).catch(err => {
            console.log(err)
          });
        }
        else {
          this.bankdetails[0].setDefault = 1;
          // this.bankdetails[0].defaultId =   this.default[0].id;
        }
      } else { // if multiple cards
        for (var i in this.bankdetails) {
          if (this.bankdetails[i].bankId == this.idToCompare) {
            this.bankdetails[i].setDefault = 1;
          }
        }
      }
    })
  }

  getDefaultBank() {
    this.userProvider.getUserMeta('bank_default').then(data => {
      this.default = data;

      console.log("default bank id.......................", this.default);
      if (this.default.length != 0) {
        this.idToCompare = JSON.parse(this.default[0].meta_value);
        this.isDefaultAdded = true;
        this.getBankDetails();
      } else {
        this.isDefaultAdded = false;
        this.getBankDetails();
      }

    })
  }

  deletBankDetail(id) {
    console.log("deletBankDetail")
    console.log(this.bankdetails.length);
    if (this.bankdetails.length == 1) {
      this.alert.okAlertMsg("Default Card can not be deleted .");
    } else {
      this.userProvider.deleteUserMeta(id).then(data => {
        console.log(data);
        this.getBankDetails();
        this.alert.okAlertMsg("Card deleted successfully.");
      })
    }
  }

  setDefaultAddress(bankId) {
    if (this.bankdetails.length == 1) {
      this.alert.okAlertMsg("Already set as default");
      this.getDefaultBank();
    } else {
      this.userProvider.updateUserMeta('bank_default', bankId, this.default[0].id).then(data => {
        console.log(data)
        this.alert.okAlertMsg("Default Card saved successfully.");
        this.getDefaultBank();
      }).catch(err => {
        console.log(err)
      });
    }

  }

  addBank() {
    this.navCtrl.push(CustomerBankPage, { type: this.navParams.get('type'), amount: this.navParams.get("amount"), orderId: this.navParams.get("orderId") });
  }

  // paypal 

  paymentWithPaypal() {

    this.payPal.init({
      PayPalEnvironmentProduction: 'AQqLZz00rx2ibSioa1yPsNVTw1g0iO0-pbdNnq27MEjn6TSxYRpi0D5ZDakh8K3IBCp_0XFptXUUgzpr',
      PayPalEnvironmentSandbox: 'AXkzCfSbsMbZ2ZCAOzdgTPqCDs0LhoKucusv_YquaRwMdzEBZA8euT3iugFk3R5l1IkDtu_AXxu21Wgn'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let amount = this.navParams.get("amount");
        let payment = new PayPalPayment(amount, 'USD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then(() => {
           console.log(payment);
            this.orderComplete();
          // Successfully paid

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          // Error or render dialog closed without being successful

          console.log("Error or render dialog closed without being successful");
        });
      }, () => {
        // Error in configuration

        console.log("v")
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
      console.log("Error in initialization, maybe PayPal isn't supported or something else");
    });
  }

  // stripe

  payNow(bank) {
    if(!this.show) {
      console.log(bank)
      let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader
      loading.present(); //loading present
      console.log('createCard');

      this.stripe.setPublishableKey('pk_test_8D9ZyPRtr4YNO6nz5cQoaicN');
      let card = {
        number: bank.number,
        name: bank.name,
        expMonth: bank.expMonth,
        expYear: bank.expYear,
        cvc: bank.cvc
      };
      console.log('card');
      console.log(card);
      this.stripe.createCardToken(card).then((token) => {
        console.log('stripe token');
        console.log(token);

        var stripeInfo = {
          stripetoken: token,
          token: this.userProvider.token,
          amount: Number.parseInt((this.navParams.get("amount") * 100).toString())
        }
        this.utilsProvider.stripePay(stripeInfo).then(data => {
          console.log('stripePay data');
          console.log(data)
          this.orderComplete();
          loading.dismiss(); // loading dismiss
        }, err => {
          loading.dismiss(); //loading dismiss
          console.log(err);
          this.alert.okAlertTitleMsg("Error", err);
        })
      }).catch(err => {
        console.log('stripe err')
        console.log(JSON.stringify(err))
        loading.dismiss(); //loading dismiss
        this.alert.okAlertTitleMsg("Error", err);
      })
    }
  }

  orderComplete() {
    this.orderProvider.orderComplete({
      order_id: this.navParams.get("orderId"),
      total_cost: this.navParams.get("amount"),
      token: this.userProvider.token
    }).then(data => {

      this.alert.okAlertMsg('Transaction Successfull!!');
      this.navCtrl.setRoot(CustomerHomePage);

    }, err => {
      console.log("orderComplete err")

      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }
}
