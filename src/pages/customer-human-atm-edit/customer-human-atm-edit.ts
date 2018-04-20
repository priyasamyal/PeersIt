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

import { CustomerHumanAtmEditModel } from './customer-human-atm-edit.model';
import { CustomerBankPage } from '../customer-bank/customer-bank';
import { CustomerOrderListPage } from '../customer-order-list/customer-order-list';

/**
 * Generated class for the CustomerHumanAtmEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-customer-human-atm-edit',
  templateUrl: 'customer-human-atm-edit.html',
})
export class CustomerHumanAtmEditPage {
  @ViewChild(GoogleMap) _GoogleMap: GoogleMap;
  map_model: MapsModel = new MapsModel();

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  customerSecretCode: any = [];
  disabled = false;

  map_drop: MapsModel = new MapsModel();

  secretCode: any;
  customerEditOrder: CustomerHumanAtmEditModel = new CustomerHumanAtmEditModel();

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
    console.log("CustomerHumanAtmEditPage constructor");
    if(this.userProvider.settings.consumer_order_type == 2)
      this.getSecretCode();
    this.getOrderDetails(this.navParams.get('orderId'));
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
    this.customerEditOrder.endTime = moment(new Date(new Date(this.customerEditOrder.startTime).getTime() + (30 * 60 * 1000)).toISOString()).locale('es').format();
  }

  //used to set estimated amount of the order
  setEstimatedAmount(evt) {
    if (evt == 1) {
      this.customerEditOrder.estimatedgGoodsPrice = 0;
    }

  }
  // set order time & date time check
  orderType(evt) {

    this.customerEditOrder.orderType = evt;
    if (evt == 1) {
      this.customerEditOrder.startTime = moment(new Date().toISOString()).locale('es').format();
      this.customerEditOrder.endTime = moment(new Date(new Date(this.customerEditOrder.startTime).getTime() + (60 * 60 * 1000)).toISOString()).locale('es').format();
    }
    else {
      this.customerEditOrder.startTime = moment(new Date().toISOString()).locale('es').format();
      this.customerEditOrder.endTime = moment(new Date(new Date(this.customerEditOrder.startTime).getTime() + (30 * 60 * 1000)).toISOString()).locale('es').format();
      console.log(this.customerEditOrder.startTime);
      console.log(this.customerEditOrder.endTime);
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
    } else if (this.customerEditOrder.estimatedgGoodsPrice == undefined) {
      this.alert.okAlertMsg("Fill Order Amount!");
    } else if (this.customerEditOrder.orderType == undefined) {
      this.alert.okAlertMsg("Fill Order Type!");
    } else if (this.customerEditOrder.startTime == undefined) {
      this.alert.okAlertMsg("Fill Start Time!");
    } else if (this.customerEditOrder.endTime == undefined) {
      this.alert.okAlertMsg("Fill End Time!");
    } else if (this.customerEditOrder.items.length > 0) {
      this.customerEditOrder.items[0].quantity = this.customerEditOrder.estimatedgGoodsPrice;
      if (this.map_drop.search_query != "" && this.customerEditOrder.dropLong == undefined && this.customerEditOrder.dropLong == undefined) {
        this.getLatLongManually(this.map_drop.search_query, "drop");
      }

      if (this.customerEditOrder.dropLat == undefined && this.customerEditOrder.dropLong == undefined) {
        this.customerEditOrder.dropLat = this.map_drop.directions_origin.location.lat();
        this.customerEditOrder.dropLong = this.map_drop.directions_origin.location.lng();
      }
      this.hitOrderApi();
    }
  }

  hitOrderApi() {
    this.disabled = true;
    var oderInfo: any = {
      supplier_id: this.customerEditOrder.supplierId,
      order_id: this.navParams.get('orderId'),
      category_id: 1, // static
      dropoff_postal_code: this.customerEditOrder.zipcode,
      consumer_id: this.userProvider.user.id,
      consumer_estimated_cost: this.customerEditOrder.estimatedgGoodsPrice,
      dropoff_lat: this.customerEditOrder.dropLat,
      dropoff_lng: this.customerEditOrder.dropLong,
      order_description: this.customerEditOrder.description,
      window_start: this.customerEditOrder.startTime,
      window_end: this.customerEditOrder.endTime,
      order_type: this.customerEditOrder.orderType,
      token: this.userProvider.token,
      items: this.customerEditOrder.items,
/*       secret_codes: this.customerEditOrder.secretCode,
      secret_code_status: this.secretCode?1:0,
 */      dropoff_address: this.map_drop.search_query,
      coupon_code: this.customerEditOrder.couponCode,
      is_alcohol: 0,
      already_paid: 0,
      pickup_address: ""
    }
    console.log(oderInfo);
    this.orderProvider.editOrder(oderInfo).then(data => {
      console.log("this.orderProvider.addOrder success");
      console.log(data);
      console.log("this.secretCode");
      console.log(this.secretCode);
/*       if (this.secretCode) {
        var od = {
          order_id: data,
          secret_codes: this.secretCode.toString(),
          user_id: this.userProvider.user.id,
          category_id: 1, // static
          token: this.userProvider.token
        }
        this.orderProvider.addOrderSecretCodes(od);
      }
 */      this.alert.okAlertMsg("Order submitted successfully");
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
      this.customerEditOrder.zipcode = data;
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
    console.log('ionViewDidLoad CustomerHumanAtmEditPage');
  }

  getLatLongManually(address, pick_drop) { // find  lat long when manually add location
    console.log("getLatLongManually");
    var env = this;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

        console.log("drop location : " + results[0].geometry.location.lat() + " " + results[0].geometry.location.lng());
        env.customerEditOrder.dropLat = results[0].geometry.location.lat();
        env.customerEditOrder.dropLong = results[0].geometry.location.lng();
        env.utilsProvider.getZipCode(results[0].geometry.location.lat(), results[0].geometry.location.lng()).then(data => {
          console.log("this.orderProvider.getZipCode success");
          console.log(data);
          env.customerEditOrder.zipcode = data;
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


  // Used to get order details
  getOrderDetails(orderId) {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader create
    loading.present();// loading present
    this.orderProvider.getOrderDetails(orderId).then(data => {
      var od = JSON.parse(JSON.stringify(data))
      od.order_details.map(item => {
        item.quantity = "" + item.quantity;
      });
      this.customerEditOrder.items = od.order_details;
      this.customerEditOrder.description = od.order_description;
      this.customerEditOrder.estimatedgGoodsPrice = od.consumer_estimated_cost;
      this.customerEditOrder.startTime = od.window_start;
      this.customerEditOrder.endTime = od.window_end;
      this.customerEditOrder.orderType = od.order_type;
      this.customerEditOrder.zipcode = od.dropoff_postal_code;
      //      this.customerEditOrder.using_geolocation:boolean = false;
      this.customerEditOrder.dropLat = od.dropoff_lat;
      this.customerEditOrder.dropLong = od.dropoff_lng;
      this.customerEditOrder.secretCode = od.secret_codes;
      this.customerEditOrder.couponCode = od.coupon_code;
      this.map_drop.search_query = od.dropoff_address;
      if (od.supplier_id)
        this.customerEditOrder.supplierId = od.supplier_id;
      loading.dismiss(); // loading dismiss
    }, err => {
      loading.dismiss(); // loading dismiss
      console.log("getOrderDetails err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }
}
