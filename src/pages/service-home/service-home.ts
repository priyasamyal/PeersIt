import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Range, MenuController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { Observable } from 'rxjs/Observable';

import { GoogleMap } from "../../components/google-map/google-map";

import { ServiceOrderFilterPage } from '../service-order-filter/service-order-filter';
import { ServiceOrderListPage } from '../service-order-list/service-order-list';
import { ServiceOrderDetailPage } from '../service-order-detail/service-order-detail';
import { ServiceOrderMapListPage } from '../../pages/service-order-map-list/service-order-map-list';

import moment from 'moment';
import { Api } from '../../providers/api/api';
import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
import { AlertProvider } from '../../providers/alert/alert';
import { MapProvider } from '../../providers/map/map';
import { MapsModel, MapPlace } from '../../providers/map/maps.model';

declare var google: any;


/**
 * Generated class for the ServiceHomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-home',
  templateUrl: 'service-home.html',
})
export class ServiceHomePage {
  @ViewChild(GoogleMap) _GoogleMap: GoogleMap;
  map_model: MapsModel = new MapsModel();

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  name: any;
  firstRun: boolean = true;
  interval: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modal: ModalController,
    public menuController: MenuController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public mapProvider: MapProvider,
    public geolocation: Geolocation,
    public orderProvider: OrderProvider,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider,
    public alert: AlertProvider,
    public api: Api
  ) {
    console.log('ServiceHomePage constructor');
    this.menuController.enable(true, "service");
    if (this.userProvider.user.last_name != null)
      this.name = this.userProvider.user.first_name + " " + this.userProvider.user.last_name
    else
      this.name = this.userProvider.user.first_name
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceHomePage');
    this.getUserSettings();
    this.userProvider.getAddressList();
    this.userProvider.getUserMeta('secret_code');
    this.userProvider.orderFilter = Object.assign({}, this.utilsProvider.orderFilter);
  }

  //initialize the loading controller
  ngOnInit() {
    let _loading = this.loadingCtrl.create();
    _loading.present();
    this._GoogleMap.$mapReady.subscribe(map => {
      this.map_model.init(map);
      _loading.dismiss();
      this.interval = setInterval(() => {
        if (this.userProvider.currentLocation.lat != 0 && this.userProvider.currentLocation.lng != 0)
          this.firstRun = false;
        if (!this.firstRun) {
          var latLongInfo = {
            user_id: this.userProvider.user.id,
            lat: this.userProvider.currentLocation.lat,
            lng: this.userProvider.currentLocation.lng,
            token: this.userProvider.token
          }
          this.userProvider.sendLatLong(latLongInfo);
          this.setOrigin();
          clearInterval(this.interval);
        }
      }, 100);
    });
  }

  //used to set the origin
  setOrigin() {
    console.log("setOrigin");
    // Clean map
    this.map_model.cleanMap();
    // Set the origin for later directions
    this.map_model.directions_origin.location = new google.maps.LatLng(this.userProvider.currentLocation.lat, this.userProvider.currentLocation.lng);
    this.map_model.addPlaceToMap(this.map_model.directions_origin.location, '#00e9d5');
    this.map_model.map.panTo(this.map_model.directions_origin.location);
    this.map_model.map.setZoom(15);
    // With this result we should find restaurants (*places) arround this location and then show them in the map
    this.getOrders();
  }

  // Used to get the orders list 
  getOrders() {
    this.orderProvider.getAllServiceOrders(Object.assign({}, this.userProvider.orderFilter)).then(data => {
      console.log("this.orderProvider.getCustomerOrderMapList success");
      console.log("orders.......................");
      console.log(data);

      var d = JSON.parse(JSON.stringify(data))
      if (d.length > 0) {
        var env = this;

        let bound = new google.maps.LatLngBounds();
        bound.extend(this.map_model.directions_origin.location);

        var y = {};
        for (var x of d) {
          if (y[Number(x.dropoff_lat).toFixed(3) + "," + Number(x.dropoff_lng).toFixed(3)])
            y[Number(x.dropoff_lat).toFixed(3) + "," + Number(x.dropoff_lng).toFixed(3)].push(x)
          else
            y[Number(x.dropoff_lat).toFixed(3) + "," + Number(x.dropoff_lng).toFixed(3)] = [x]
        }

        Object.keys(y).map(g => {
          var loc = new google.maps.LatLng(...g.split(","));
          bound.extend(loc);

          var marker = env.map_model.addPlaceToMap(loc).marker;

          var df = this.utilsProvider.prepareOrderDetails(y[g]);
          google.maps.event.addListener(marker, 'click', function () {
            console.log(data);
            if (df.length == 1)
              env.navCtrl.setRoot(ServiceOrderDetailPage, { 'orderDetail': df[0], 'status': 0 });
            else
              env.navCtrl.push(ServiceOrderMapListPage, { 'orderList': df });
          });

        })
        env.map_model.map.fitBounds(bound);
      }
    }, err => {
      console.log("getCustomerOrderMapList err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  // Used to accept order navigate to service order list page
  acceptOrder() {
    this.navCtrl.push(ServiceOrderListPage);
  }

  // Used to get user settings page
  getUserSettings() {
    this.userProvider.getUserSettings().then(data => {
      var d = JSON.parse(JSON.stringify(data));
      console.log(d)
      if (!d.length) {
        console.log("getUserSettings if")
        var settings = {};
        if (this.userProvider.userType == 1) {
          this.userProvider.settings = Object.assign({}, this.utilsProvider.customerSettings);
          settings = Object.assign({}, this.utilsProvider.customerSettings);
        }
        else if (this.userProvider.userType == 2) {
          this.userProvider.settings = Object.assign({}, this.utilsProvider.serviceSettings);
          settings = Object.assign({}, this.utilsProvider.serviceSettings);
        }
        settings["user_id"] = this.userProvider.user.id;
        settings["user_type"] = this.userProvider.userType;
        this.userProvider.saveUserSettings(settings).then(data => {
          console.log("this.userProvider.saveUserSettings success");
          console.log(data);
        }, err => {
          console.log("saveUserSettings err")
          console.log(err)
        })
      }

    }, err => {
      console.log("getUserSettings err");
      console.log(err);
    });
  }

  //Used to get the profile image
  getProfileImageStyle() {
    var image = "assets/images/user/no-profile.png";
    if (this.userProvider.user.profile_image) {
      if (this.userProvider.user.profile_image.includes("facebook") || this.userProvider.user.profile_image.includes("google"))
        image = this.userProvider.user.profile_image;
      else
        image = this.api.imageUrl + this.userProvider.user.profile_image;
    }
    return 'url(' + image + ')'
  }

  showFilter() {
    let modal = this.modal.create(ServiceOrderFilterPage);
    modal.onDidDismiss(data => {
      this.getOrders();
    });
    modal.present();
  }

  test() {
    console.log("test")
    this.utilsProvider.getDistance(this.userProvider.currentLocation.lat, this.userProvider.currentLocation.lng, 30, 70).then(data => {
      console.log(data);
    })
    console.log(this.utilsProvider.getTimeDiffernce(moment(new Date().toISOString()).locale('es').format(), moment(new Date(new Date().getTime() + (60 * 60 * 1000)).toISOString()).locale('es').format()));
  }
}
