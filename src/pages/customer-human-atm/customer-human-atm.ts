import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, Loading } from 'ionic-angular';
import moment from 'moment';
import { Observable } from 'rxjs/Rx';

import { GoogleMap } from "../../components/google-map/google-map";

import { MapProvider } from '../../providers/map/map';
import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
import { MapsModel, MapPlace } from '../../providers/map/maps.model';
import { AlertProvider } from '../../providers/alert/alert';

import { CustomerHumanAtmModel } from './customer-human-atm.model';
import { CustomerBankPage } from '../customer-bank/customer-bank';
import { CustomerOrderListPage } from '../customer-order-list/customer-order-list';

/**
 * Generated class for the CustomerHumanAtmPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-customer-human-atm',
  templateUrl: 'customer-human-atm.html',
})

export class CustomerHumanAtmPage {
  @ViewChild(GoogleMap) _GoogleMap: GoogleMap;
  map_model: MapsModel = new MapsModel();

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  customerSecretCode: any = [];
  disabled = false;

  map_drop: MapsModel = new MapsModel();

  secretCode: any;
  couponCode: any = "";
  showCoupon: boolean = true;
  customerNewOrder: CustomerHumanAtmModel = new CustomerHumanAtmModel();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public mapProvider: MapProvider,
    public orderProvider: OrderProvider,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public userProvider: UserProvider,
    public alert: AlertProvider,
    public utilsProvider: UtilsProvider
  ) {
    console.log("CustomerHumanAtmPage constructor");
    if(this.userProvider.settings.consumer_order_type == 2)
      this.getSecretCode();
  }

  //used to get secret codes
  getSecretCode() {
    this.userProvider.getUserMeta('secret_code').then(data => {
      console.log("this.userProvider.addUserMeta success");
      console.log(data);
      this.customerSecretCode = data;
      console.log(this.customerSecretCode);
    }, err => {
      console.log("err addUserMeta")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  // set End time minimum 30 mins more than start time
  setEndTime() {
    this.customerNewOrder.endTime = moment(new Date(new Date(this.customerNewOrder.startTime).getTime() + (30 * 60 * 1000)).toISOString()).locale('es').format();
  }

  //used to set estimated amount of the order
  setEstimatedAmount(evt) {
    if (evt == 1) {
      this.customerNewOrder.estimatedgGoodsPrice = 0;
    }

  }
  // set order time & date time check
  orderType(evt) {

    this.customerNewOrder.orderType = evt;
    if (evt == 1) {
      this.customerNewOrder.startTime = moment(new Date().toISOString()).locale('es').format();
      this.customerNewOrder.endTime = moment(new Date(new Date(this.customerNewOrder.startTime).getTime() + (60 * 60 * 1000)).toISOString()).locale('es').format();
    }
    else {
      this.customerNewOrder.startTime = moment(new Date().toISOString()).locale('es').format();
      this.customerNewOrder.endTime = moment(new Date(new Date(this.customerNewOrder.startTime).getTime() + (30 * 60 * 1000)).toISOString()).locale('es').format();
      console.log(this.customerNewOrder.startTime);
      console.log(this.customerNewOrder.endTime);
    }
  }

  geolocateMe() {
    this.map_drop.search_query = this.userProvider.currentLocation.lat.toFixed(2) + ", " + this.userProvider.currentLocation.lat.toFixed(2);
    this.setDropOrigin(new google.maps.LatLng(this.userProvider.currentLocation.lat, this.userProvider.currentLocation.lng));
    this.map_drop.using_geolocation = true;
    this.getAddress(this.userProvider.currentLocation.lat, this.userProvider.currentLocation.lng);
  }

  // place customer order
  placeOrder() {
    if (this.map_drop.search_query == "") {
      this.alert.okAlertMsg("Choose your drop location!");
    } else if (this.customerNewOrder.estimatedgGoodsPrice == undefined) {
      this.alert.okAlertMsg("Fill Order Amount!");
    } else if (this.customerNewOrder.orderType == undefined) {
      this.alert.okAlertMsg("Fill Order Type!");
    } else if (this.customerNewOrder.startTime == undefined) {
      this.alert.okAlertMsg("Fill Start Time!");
    } else if (this.customerNewOrder.endTime == undefined) {
      this.alert.okAlertMsg("Fill End Time!");
    } else if (this.customerNewOrder.items.length > 0) {
      this.customerNewOrder.items[0].quantity = this.customerNewOrder.estimatedgGoodsPrice;
      if (this.map_drop.search_query != "" && this.customerNewOrder.dropLong == undefined && this.customerNewOrder.dropLong == undefined) {
        this.getLatLongManually(this.map_drop.search_query, "drop");
      }

      if (this.customerNewOrder.dropLat == undefined && this.customerNewOrder.dropLong == undefined) {
        this.customerNewOrder.dropLat = this.map_drop.directions_origin.location.lat();
        this.customerNewOrder.dropLong = this.map_drop.directions_origin.location.lng();
      }
      this.hitOrderApi();
    }
  }

  hitOrderApi() {
    this.disabled = true;
    var oderInfo: any = {
      category_id: 1, // static
      dropoff_postal_code: this.customerNewOrder.zipcode,
      consumer_id: this.userProvider.user.id,
      consumer_estimated_cost: this.customerNewOrder.estimatedgGoodsPrice,
      dropoff_lat: this.customerNewOrder.dropLat,
      dropoff_lng: this.customerNewOrder.dropLong,
      order_description: this.customerNewOrder.description,
      window_start: this.customerNewOrder.startTime,
      window_end: this.customerNewOrder.endTime,
      order_type: this.customerNewOrder.orderType,
      token: this.userProvider.token,
      items: this.customerNewOrder.items,
      secret_codes: this.secretCode? this.secretCode.toString():"",
      secret_code_status: this.secretCode?1:0,
      dropoff_address: this.map_drop.search_query,
      coupon_code: this.customerNewOrder.couponCode,
      is_alcohol: 0,
      already_paid: 0,
      pickup_address: ""
    }
    console.log(oderInfo);
    this.orderProvider.addOrder(oderInfo).then(data => {
      console.log("this.orderProvider.addOrder success");
      console.log(data);
      console.log("this.secretCode");
      console.log(this.secretCode);
      if (this.secretCode != undefined) {
        var od = {
          order_id: data,
          secret_codes: this.secretCode.toString(),
          user_id: this.userProvider.user.id,
          category_id: 1, // static
          token: this.userProvider.token
        }
        this.orderProvider.addOrderSecretCodes(od);
      }
      this.alert.okAlertMsg("Order submitted successfully");
      this.navCtrl.setRoot(CustomerOrderListPage);
    }, err => {
      console.log("err addOrder")
      console.log(err);
      this.disabled = false;
      this.alert.okAlertTitleMsg("Error", err);
    });
  }

  //used to get address using latlong
  getAddress(lat, lng) {
    let env = this;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': new google.maps.LatLng(lat, lng) }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          // Formatted address
          env.map_drop.search_query = results[0].formatted_address;
        }
      }
    })
  }

  //get drop location predictions
  searchDropPlacesPredictions(query: string) {
    let env = this;
    if (query !== "") {
      env.mapProvider.getPlacePredictions(query).subscribe(places_predictions => {
        env.map_drop.search_places_predictions = places_predictions;
      });
    }
    else
      env.map_drop.search_places_predictions = [];
  }

  setDropOrigin(location: google.maps.LatLng) {
    console.log("setDropOrigin");
    console.log(location.lat());
    console.log(location.lng());
    let env = this;

    // Clean map
    env.map_drop.cleanSearch();

    // Set the origin for later directions
    env.map_drop.directions_origin.location = location;
    this.utilsProvider.getZipCode(location.lat(), location.lng()).then(data => {
      console.log("this.orderProvider.getZipCode success");
      console.log(data);
      this.customerNewOrder.zipcode = data;
    }, err => {
      console.log("err getZipCode")
      console.log(err)
    });
  }

  //drop search results
  selectDropSearchResult(place: google.maps.places.AutocompletePrediction) {
    let env = this;

    env.map_drop.search_query = place.description;
    env.map_drop.search_places_predictions = [];

    // We need to get the location from this place. Let's geocode this place!
    env.mapProvider.geocodePlace(place.place_id).subscribe(place_location => {
      env.setDropOrigin(place_location);
    });
  }

  //clear the drop search results
  clearDropSearch() {
    this.map_drop.cleanSearch();
    this.map_drop.using_geolocation = false;
  }

  ngOnInit() {
    console.log("ngOnInit");
    this._GoogleMap.$mapReady.subscribe(map => {
      this.map_model.init(map);
      this.map_model.directions_origin.location = new google.maps.LatLng(this.userProvider.currentLocation.lat, this.userProvider.currentLocation.lng);
/*     this.map_model.map.setCenter(this.map_model.directions_origin.location);
    this.map_model.map.panTo(this.map_model.directions_origin.location);
 */    this.map_model.addPlaceToMap(this.map_model.directions_origin.location, '#00e9d5');
      this.getHumanAtms();
      console.log(this.map_model.directions_origin.location);
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerHumanAtmPage');
  }

  getLatLongManually(address, pick_drop) { // find  lat long when manually add location
    console.log("getLatLongManually");
    var env = this;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

        console.log("drop location : " + results[0].geometry.location.lat() + " " + results[0].geometry.location.lng());
        env.customerNewOrder.dropLat = results[0].geometry.location.lat();
        env.customerNewOrder.dropLong = results[0].geometry.location.lng();
        env.utilsProvider.getZipCode(results[0].geometry.location.lat(), results[0].geometry.location.lng()).then(data => {
          console.log("this.orderProvider.getZipCode success");
          console.log(data);
          env.customerNewOrder.zipcode = data;
        }, err => {
          console.log("err getZipCode")
          console.log(err)
        });

      } else {
        console.log("Something got wrong " + status);
      }
    });
  }

  getHumanAtms() {
    var atmsInfo = {
      lat: this.userProvider.currentLocation.lat,
      lng: this.userProvider.currentLocation.lng,
      radius: 10,
      token: this.userProvider.token
    }
    this.orderProvider.getNearbyHumanAtms(atmsInfo).then(data => {
      console.log("this.orderProvider.getNearbyHumanAtms success");
      console.log(data);
      this.addMarkers(data);
    }, err => {
      console.log("err getNearbyHumanAtms")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  addMarkers(atmsList) {
    this.map_model.cleanMap();
    // Set the origin for later directions
    this.map_model.directions_origin.location = new google.maps.LatLng(this.userProvider.currentLocation.lat, this.userProvider.currentLocation.lng);
    this.map_model.map.setCenter(this.map_model.directions_origin.location);
    this.map_model.map.panTo(this.map_model.directions_origin.location);
    this.map_model.addPlaceToMap(this.map_model.directions_origin.location, '#00e9d5');
    // With this result we should find restaurants (*places) arround this location and then show them in the map

    let bound = new google.maps.LatLngBounds();
    atmsList.map(g => {
      if (g.lat && g.lng) {
        var loc = new google.maps.LatLng(g.lat, g.lng);
        bound.extend(loc);
        this.map_model.addPlaceToMap(loc).marker;
      }
    })
    this.map_model.map.fitBounds(bound);
  }

  getCheckOrderCreateSettings(lat, lng) {
    console.log("getCheckOrderCreateSettings");
    var orderSettings = {
      pcode: this.customerNewOrder.zipcode,
      lat: lat,
      lng: lng,
      token: this.userProvider.token
    }
    this.orderProvider.getCheckOrderCreateSettings(orderSettings).then(response => {
      let res = JSON.parse(JSON.stringify(response))
      let h = {};
      for (let d of res.data) { h[d.settings_name] = d.settings_value; }
      for (let d of res.data) {
        if (d.settings_name == "on_demand_deliv_status")
          this.customerNewOrder.setting.onDemand = d.settings_value == 1 ? false : true;
        else if (d.settings_name == "resting_deliv_status")
          this.customerNewOrder.setting.resting = d.settings_value == 1 ? false : true;
        else if (d.settings_name == "max_allowed_days_option") {
          if (h["resting_allowed_days"])
            switch (d.settings_value) {
              case "Days":
                this.customerNewOrder.maxStart = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * parseInt(h["resting_allowed_days"]))).toISOString();
                break;
              case "Months":
                this.customerNewOrder.maxStart = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30 * parseInt(h["resting_allowed_days"]))).toISOString();
                break;
              case "Years":
                this.customerNewOrder.maxStart = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365 * parseInt(h["resting_allowed_days"]))).toISOString();
                break;
            }
        }
      }
      console.log("resting_min_suppliers test")
      console.log(h["resting_min_suppliers"])
      console.log(res.resting_sup)
      console.log(h["resting_min_suppliers"] < res.resting_sup)
      if (!this.customerNewOrder.setting.resting && h["resting_min_suppliers"] <= res.resting_sup)
        this.customerNewOrder.setting.resting = false;
      else
        this.customerNewOrder.setting.resting = true;
      if (!this.customerNewOrder.setting.onDemand && h["on_demand_min_suppliers"] <= res.on_demand_sup)
        this.customerNewOrder.setting.onDemand = false;
      else
        this.customerNewOrder.setting.onDemand = true;
      if (this.customerNewOrder.setting.onDemand && this.customerNewOrder.setting.resting){
        this.alert.okAlertTitleMsg("Error", "Once ordering is enabled near you, we will notify you via the app, email, or text.");
        this.customerNewOrder.orderType = undefined;
      }
      else if (this.customerNewOrder.orderType == 0 && this.customerNewOrder.setting.onDemand){
        this.alert.okAlertTitleMsg("Error", "Currently On Demand order is not avialable.");
        this.customerNewOrder.orderType = 1;
      }
      else if (this.customerNewOrder.orderType == 1 && this.customerNewOrder.setting.resting){
        this.alert.okAlertTitleMsg("Error", "Currently Resting order is not avialable.");
        this.customerNewOrder.orderType = 0;
      }
      if(this.customerNewOrder.startTime){
        let timeDifference = this.utilsProvider.getTimeDiffernce(this.customerNewOrder.startTime, this.customerNewOrder.maxStart)
        if(timeDifference <= 0)
          this.alert.okAlertTitleMsg("Error", "Not allowed in this time frame.");  
      }
      console.log("this.customerNewOrder");
      console.log(this.customerNewOrder);
    }, (err) => {
      this.alert.okAlertMsg("We will serve your location soon. Please check Peers It periodically or request that we activate in your city ASAP.");
    });
  }

  addCoupon(){
    this.showCoupon = false;
  }

  cancelCoupon(){
      this.showCoupon = true;
      this.couponCode = "";
  }

  applyCoupon(){
    this.orderProvider.verifyCoupon(this.couponCode).then(data => {
      this.alert.okAlertMsg('Coupon applied Successfully!')
      this.customerNewOrder.couponCode = this.couponCode;
    }, err => {
      this.alert.okAlertTitleMsg('Error', 'Coupon entered is Invalid.')
      this.couponCode = "";
    });
  }
}
