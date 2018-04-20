import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Rx';

import { MapProvider } from '../../providers/map/map';
import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
import { MapsModel, MapPlace } from '../../providers/map/maps.model';
import { AlertProvider } from '../../providers/alert/alert';

import { CustomerAddSecretCodeModel } from './customer-add-secret-code.model';
import { CustomerSettingsPage } from '../customer-settings/customer-settings';
/**
 * Generated class for the CustomerSecretCodeListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer-secret-code-list',
  templateUrl: 'customer-secret-code-list.html',
})
export class CustomerSecretCodeListPage {

  customerSecretCode: CustomerAddSecretCodeModel = new CustomerAddSecretCodeModel();
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider,
    public alert: AlertProvider,
  ) {
    this.getSecretCode();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerSecretCodeListPage');
  }

//Used to get secret code
  getSecretCode() {
    this.userProvider.getUserMeta('secret_code').then(data => {
      console.log("this.userProvider.addUserMeta success");
      console.log(data);
      this.customerSecretCode.secretcodeList = data;
    }, err => {
      console.log("addUserMeta err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })

  }

//used to save secret codes
  saveSecretCode() { 
    this.userProvider.addUserMeta('secret_code', this.customerSecretCode.code).then(data => {
      console.log("this.userProvider.addUserMeta success");
      console.log(data);
      this.customerSecretCode.code = '';
      this.alert.okAlertMsg("Secret code added successfully");
      this.customerSecretCode.showCode = true;
      this.getSecretCode();
      // this.navCtrl.push(CustomerSettingsPage);
    }, err => {
      console.log("addUserMeta err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

//used to delete secret code
  deleteCode(_id) { 
    this.userProvider.deleteUserMeta(_id).then(data => {
      this.customerSecretCode.code = '';
      this.alert.okAlertMsg("Secret code deleted");
      this.getSecretCode();

      // this.navCtrl.push(CustomerSettingsPage);
    }, err => {
      console.log("addUserMeta err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  edit(meta_value, id) {
    this.customerSecretCode.showEdit = true;
    this.customerSecretCode.showCode = false;
    this.customerSecretCode.code = meta_value;
    this.customerSecretCode.id = id;
  }

// Use to edit secret codes
  editCode() { 
    this.userProvider.updateUserMeta('secret_code', this.customerSecretCode.code, this.customerSecretCode.id).then(data => {
      this.customerSecretCode.code = '';
      this.alert.okAlertMsg("Secret code updated");
      this.getSecretCode();
      this.customerSecretCode.showEdit = false;
      this.customerSecretCode.showCode = true;
      // this.navCtrl.push(CustomerSettingsPage);
    }, err => {
      console.log("addUserMeta err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

// used to add service codes
  addCode() {
    this.customerSecretCode.showCode = false;
  }

  doneCode() {
    this.navCtrl.setRoot(CustomerSettingsPage);
  }

  //used to cancel secret code
  cancelCode() {
    this.customerSecretCode.showCode = true;
    this.customerSecretCode.code = '';
  }
}
