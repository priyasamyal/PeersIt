import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { CustomerAddAddressPage } from '../customer-add-address/customer-add-address';

import { AlertProvider } from '../../providers/alert/alert';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the CustomerAddressPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer-address',
  templateUrl: 'customer-address.html',
})
export class CustomerAddressPage {
  addressList: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider,
    private loadingCtrl: LoadingController,
    public alert: AlertProvider, ) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerAddressPage');
  }

  ionViewWillEnter() {
    this.getAddressList();
  }

//Used to navigate to customeraddress page
  addAddress() {
    this.navCtrl.push(CustomerAddAddressPage);
  }

//Used to get the address list
  getAddressList() {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); //loader create
    loading.present(); // loading present
    this.userProvider.getAddressList().then(data => {
      console.log("add address...........", data);
      this.addressList = data;
      loading.dismiss();
      console.log("address list.....",this.addressList)
    }, err => {
      loading.dismiss(); //loading dismiss
      console.log(err);
      this.alert.okAlertTitleMsg("Error", err);
    });
  }

//Used to set default address 
  setDefaultAddress(_id) {
    let adreesObj = {
      user_id: this.userProvider.user.id,
      address_id: _id,
      token: this.userProvider.token
    }
    this.userProvider.setDefaultAddress(adreesObj).then(data => {
      console.log(data);
      this.getAddressList();
    }, err => {
      console.log(err);
      this.alert.okAlertTitleMsg("Error", err);
    });
  }

  //delete address 
  deleteAddress(_id,set_default){
    if(set_default==1){
      this.alert.okAlertMsg("Default address cannot be deleted!");
    }else{
      let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); //loader create
    loading.present(); // loading present
    this.userProvider.deleteAddress(_id).then(data => {
      console.log("delete address...........", data);
      loading.dismiss();
       this.alert.okAlertMsg("Address deleted!");
      this.getAddressList();
    }, err => {
      loading.dismiss(); //loading dismiss
      console.log(err);
      this.alert.okAlertTitleMsg("Error", err);
    });
    }
    
  }

}
