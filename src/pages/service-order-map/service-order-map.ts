import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, PopoverController, Range } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { Observable } from 'rxjs/Observable';

import { GoogleMap } from "../../components/google-map/google-map";

import { ServiceOrderFilterPage } from '../service-order-filter/service-order-filter';
import { ServiceOrderListPage } from '../service-order-list/service-order-list';
import { ServiceOrderDetailPage } from '../service-order-detail/service-order-detail';
import { ServiceOrderMapListPage } from '../../pages/service-order-map-list/service-order-map-list';

import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
import { AlertProvider } from '../../providers/alert/alert';
import { MapProvider } from '../../providers/map/map';
import { MapsModel, MapPlace } from '../../providers/map/maps.model';

declare var google: any;

/**
 * Generated class for the ServiceOrderMapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-order-map',
  templateUrl: 'service-order-map.html',
})
export class ServiceOrderMapPage {
  @ViewChild(GoogleMap) _GoogleMap: GoogleMap;
  map_model: MapsModel = new MapsModel();

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  supplierLat: any;
  radius = 5;
  category: any;
  filter: any;
  lat: any;
  long: any;
  name: any;
  firstRun = true;
  orderList: any = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public mapProvider: MapProvider,
    public geolocation: Geolocation,
    public popoverCtrl: PopoverController,
    public orderProvider: OrderProvider,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider,
    public alert: AlertProvider,
  ) {
    this.name = this.userProvider.user.first_name + " " + this.userProvider.user.last_name
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceOrderMapPage');
    //    this.loadMap();
  }

// Used to initilize loading controller
  ngOnInit() {
    let _loading = this.loadingCtrl.create();
    _loading.present();

    this._GoogleMap.$mapReady.subscribe(map => {
      this.map_model.init(map);
//      this.watchUserPosition();
      _loading.dismiss();
      this.geolocateMe();
    });
  }

// Used to get current location of the user
  geolocateMe() {
    console.log("geolocateMe")
    let env = this;
    this.geolocation.getCurrentPosition().then((position) => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;

      let current_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      env.map_model.search_query = position.coords.latitude.toFixed(3) + ", " + position.coords.longitude.toFixed(3);
      env.setOrigin(position.coords.latitude, position.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

// Used to see the user's position
  watchUserPosition() {
    console.log("watchUserPosition")
    let watch = this.geolocation.watchPosition({
      timeout: 50000,
      enableHighAccuracy: false
    });
    watch.subscribe(position => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;

      this.setOrigin(position.coords.latitude, position.coords.longitude);
    }, err => {
      console.log('Error getting location', err);
    });
  }

//used to set the origin
  setOrigin(lat, long) {
    console.log("setOrigin");
    let env = this;

    // Clean map
    env.map_model.cleanMap();

    // Set the origin for later directions
    env.map_model.directions_origin.location = new google.maps.LatLng(lat, long);

    env.map_model.addPlaceToMap(new google.maps.LatLng(lat, long), '#00e9d5');

    // With this result we should find restaurants (*places) arround this location and then show them in the map

    let orderInfo = {
      lat: lat,
      lng: long,
      radius: this.radius,
      token: this.userProvider.token
    }
    this.orderProvider.getAllServiceOrders(orderInfo).then(data => {
      console.log("this.orderProvider.getCustomerOrderMapList success");
      console.log("orders.......................");
      console.log(data);

      var env = this;

      var d = JSON.parse(JSON.stringify(data))

      let bound = new google.maps.LatLngBounds();

      var y = {};
      for (var x of d) {
        if (y[Number(x.dropoff_lat).toFixed(3) + "," + Number(x.dropoff_lng).toFixed(3)])
          y[Number(x.dropoff_lat).toFixed(3) + "," + Number(x.dropoff_lng).toFixed(3)].list.push(x)
        else
          y[Number(x.dropoff_lat).toFixed(3) + "," + Number(x.dropoff_lng).toFixed(3)] = { list: [x], marker: null }
      }

      if (Object.keys(this.orderList).length == 0) {
        Object.keys(y).map(g => {
          var loc = new google.maps.LatLng(...g.split(","));
          bound.extend(loc);

          var marker = env.map_model.addPlaceToMap(loc).marker;
          y[g].marker = marker;

        var df = this.utilsProvider.prepareOrderDetails(y[g]);
			google.maps.event.addListener(marker, 'click', function () {
				console.log(data);
				if(df.length == 1)
          env.navCtrl.push(ServiceOrderDetailPage, { 'orderDetail': df[0] });
          else
          env.navCtrl.push(ServiceOrderMapListPage,{'orderList':df});
			});
        this.orderList = y;
})

      for (var i = 0; i < Object.keys(y).length; i++) {
        var loc = new google.maps.LatLng(d[i].dropoff_lat, d[i].dropoff_lng);
        bound.extend(loc);
        env.map_model.addPlaceToMap(loc);
      }

      }
      else {
        console.log("else");
        var xcv = this.checkLists(this.orderList, y);
        console.log("xcv");
        console.log(xcv);
        console.log("y");
        console.log(y);
        console.log("this.orderList");
        console.log(this.orderList);
        if (xcv.add)
          Object.keys(xcv.add).map(g => {
            var loc = new google.maps.LatLng(...g.split(","));
            bound.extend(loc);

            var marker = env.map_model.addPlaceToMap(loc).marker;

            xcv.add[g].marker = marker;

            var df = this.utilsProvider.prepareOrderDetails(xcv.add[g].list);
            google.maps.event.addListener(marker, 'click', function () {
              console.log(data);
              if (df.length == 1)
                env.navCtrl.setRoot(ServiceOrderDetailPage, { 'orderDetail': df[0] });
            });

          })
        else if (xcv.remove) {
          Object.keys(xcv.remove).map(g => {
            xcv.remove[g].marker.setMap(null);
          })
        }
      }

      // To fit map with places
      if (this.firstRun) {
        env.map_model.map.fitBounds(bound);
        this.firstRun = false;
      }

    }, err => {
      console.log("getCustomerOrderMapList err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })

  }

//used to check the list of orders
  checkLists(old, new1) {
    var obj = {
      remove: {},
      add: {},
      match: {}
    }

    for (var o in old) {
      if (new1.hasOwnProperty(o))
        obj.match[o] = new1[o];
      else
        obj.remove[o] = old[o]
      delete new1[o];
    }
    obj.add = new1
    return obj;
  }

  rangeChange(range: Range) {
    this.setOrigin(this.lat, this.long);
  }

// Used to navigate to service orderlist page
  acceptOrder() {
    this.navCtrl.push(ServiceOrderListPage);
  }

  presentRadioPopover(ev: UIEvent) { // show filter popover 
    this.popoverCtrl.create(ServiceOrderFilterPage).present({
      ev: ev
    });
  }
}
