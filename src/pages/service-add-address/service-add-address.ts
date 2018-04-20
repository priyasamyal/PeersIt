import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

import { ServiceAddressPage } from '../service-address/service-address';

import { AlertProvider } from '../../providers/alert/alert';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
/**
 * Generated class for the ServiceAddAddressPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-add-address',
  templateUrl: 'service-add-address.html',
})
export class ServiceAddAddressPage {
  addressForm: FormGroup;
  addressInfo: any = {};
  add_latitude: any;
  add_longitude: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alert: AlertProvider,
    public geolocation: Geolocation,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider,
    public loadingCtrl: LoadingController,
    private nativeGeocoder: NativeGeocoder
  ) {
    this.addressForm = new FormGroup({
      title: new FormControl('', Validators.compose([Validators.required])),
      zipcode: new FormControl('', Validators.compose([Validators.required])),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerAddAddressPage');
  }

// Used to get the latlong through zipcode
  getLatlong() {
    this.nativeGeocoder.forwardGeocode(this.addressForm.value.zipcode)
      .then((result: NativeGeocoderForwardResult) => {
        console.log(result);
        this.add_latitude = result.latitude;
        this.add_longitude = result.longitude;
//        this.getPostalCode();
      this.addAddress();
      }).catch((error: any) => {
        console.log(error)
        this.alert.okAlertTitleMsg("Error", "Enter Correct Zipcode");
      });
  }

  // Used to add addresses 
  addAddress() {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); //loader create
    loading.present(); //loading present
    var addressInfo: any = {
      user_id: this.userProvider.user.id,
      title: this.addressForm.value.title,
      address: this.addressForm.value.address,
      city: this.addressForm.value.city,
      state: this.addressForm.value.state,
      postal_code: this.addressForm.value.zipcode,
      country: null,
      lat: this.add_latitude,
      lng: this.add_longitude,
      set_default: 0,
      token: this.userProvider.token
    }

    if (this.userProvider.defaultAddress.length == 0)
      addressInfo.set_default = 1
    console.log(addressInfo);
    this.userProvider.addAddress(addressInfo).then(data => {
      console.log("add address...........", data);
      loading.dismiss(); // loading dismiss
      this.alert.okAlertMsg(data);
      this.navCtrl.setRoot(ServiceAddressPage);
    }, err => {
      loading.dismiss(); //loading dismiss
      console.log(err);
      this.alert.okAlertTitleMsg("Error", err);
    });
  }

// Used to get postal code 
/*  getPostalCode() {
    this.utilsProvider.getZipCode(this.add_latitude, this.add_longitude).then(data => {
      console.log("this.orderProvider.getZipCode success");
      console.log(data);
      this.zipcode = data;
    }, err => {
      console.log("getZipCode err");
      console.log(err)
    });
  }*/

}
