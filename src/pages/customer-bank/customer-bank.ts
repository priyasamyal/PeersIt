import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';

import { Http, Headers } from '@angular/http';
import { Stripe } from '@ionic-native/stripe';

import { Api } from '../../providers/api/api';
import { AlertProvider } from '../../providers/alert/alert';
import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';

import { CustomerBankDetailsPage } from '../customer-bank-details/customer-bank-details';
import { CustomerHomePage } from '../customer-home/customer-home';

declare var require;
/**
 * Generated class for the CustomerBankPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer-bank',
  templateUrl: 'customer-bank.html',
})
export class CustomerBankPage {
  card_form: FormGroup;
  minStart: any = new Date().toISOString();
  maxStart: any = new Date(new Date(this.minStart).getTime() + (1000 * 60 * 60 * 24 * 365 * 25)).toISOString();
  public SECERET_KEY: string = 'secert key 123'
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private loadingCtrl: LoadingController,
    private stripe: Stripe,
    private api: Api,
    public alert: AlertProvider,
    public orderProvider: OrderProvider,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider
  ) {
    this.card_form = new FormGroup({
//      amount: new FormControl(this.navParams.get('amount')),
      card_number: new FormControl('', Validators.required),
      card_holder: new FormControl('', Validators.required),
      cvc: new FormControl('', Validators.required),
      exp_date: new FormControl('', Validators.required),
      save_card: new FormControl(true, Validators.required)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerBankPage');
  }

  createCard() {

    let card = {
      number: this.card_form.value.card_number,
      name: this.card_form.value.card_holder,
      expMonth: this.card_form.value.exp_date.split('-')[1],
      expYear: this.card_form.value.exp_date.split('-')[0],
      cvc: this.card_form.value.cvc,
      brand: 'VISA'
    };
    console.log(card);
     var encryptKey =   this.encryptcard(JSON.stringify(card));
     this.userProvider.addUserMeta('bank_card',encryptKey).then(data => {
      console.log(data)
      this.alert.okAlertMsg("Card saved successfully.");
      this.navCtrl.setRoot(CustomerBankDetailsPage, {type: this.navParams.get('type'), amount: this.navParams.get("amount"), orderId: this.navParams.get("orderId")});
    }).catch(err => {
      console.log(err)
    });
}

  encryptcard(card) {     // Encrypt card details
 
    var CryptoJS = require("crypto-js");
    var AES = require("crypto-js/aes");
    var SHA256 = require("crypto-js/sha256");
    var small = CryptoJS.AES.encrypt(card, this.SECERET_KEY);
    console.log('Encrypt card details', small.toString());
    return small.toString();
  }

  payNow() {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader
    loading.present(); //loading present
    console.log('createCard');
    console.log(this.card_form.value);
    this.stripe.setPublishableKey('pk_test_8D9ZyPRtr4YNO6nz5cQoaicN');
    let card = {
      number: this.card_form.value.card_number,
      name: this.card_form.value.card_holder,
      expMonth: this.card_form.value.exp_date.split('-')[1],
      expYear: this.card_form.value.exp_date.split('-')[0],
      cvc: this.card_form.value.cvc
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
      console.log("stripeInfo rty")
      console.log(stripeInfo)
      this.utilsProvider.stripePay(stripeInfo).then(data => {
        console.log('stripePay data');
        console.log(data)
        this.orderProvider.orderComplete({
          order_id: this.navParams.get("orderId"),
          total_cost: this.navParams.get("amount"),
          token: this.userProvider.token
        }).then(data => {
          loading.dismiss(); // loading dismiss
          this.alert.okAlertMsg('Transaction Successfull!!');
          this.navCtrl.setRoot(CustomerHomePage);
          loading.dismiss(); //loading dismiss
        }, err => {
          console.log("orderComplete err")
          loading.dismiss(); // loading dismiss
          console.log(err)
          this.alert.okAlertTitleMsg("Error", err);
        })
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
