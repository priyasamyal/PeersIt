import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ActionSheetController, ToastController, Platform, LoadingController, Loading, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { CustomerOrderRunningListPage } from '../customer-order-running-list/customer-order-running-list';
/*import { ImagePicker } from '@ionic-native/image-picker';
*/

import moment from 'moment';
import { Observable } from 'rxjs/Rx';

import { MapProvider } from '../../providers/map/map';
import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
import { MapsModel, MapPlace } from '../../providers/map/maps.model';
import { AlertProvider } from '../../providers/alert/alert';

import { CustomerNewOrderModel } from './customer-new-order.model';
import { CustomerOrderListPage } from '../customer-order-list/customer-order-list';

/**
 * Generated class for the CustomerNewOrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var cordova: any;
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-customer-new-order',
  templateUrl: 'customer-new-order.html',
})
export class CustomerNewOrderPage {
  @ViewChild(Content) content: Content;
  customerSecretCode: any = [];

  map_pick: MapsModel = new MapsModel();
  map_drop: MapsModel = new MapsModel();

  lastImage: string = null;
  loading: Loading;
  secretCode: any;
  couponCode: any = "";
  showCoupon: boolean = true;
  customerNewOrder: CustomerNewOrderModel = new CustomerNewOrderModel();
  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    public navParams: NavParams,
    public geolocation: Geolocation,
    public mapProvider: MapProvider,
    public orderProvider: OrderProvider,
    private camera: Camera,
    private transfer: Transfer,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public userProvider: UserProvider,
    public alert: AlertProvider,
    public utilsProvider: UtilsProvider
  ) {
    this.customerNewOrder.items.push({ item: "", quantity: "", image: "" });
    if (this.userProvider.settings.consumer_order_type == 2)
      this.getSecretCode();
  }

  // Used to get the secret code
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerNewOrderPage');
  }

  // add new item
  addItem() {
    this.customerNewOrder.items.push({ item: "", quantity: "", image: "" })
    this.content.scrollToBottom();
  }

  // set order window End time minimum 30 mins more than start time
  setEndTime() {
    this.customerNewOrder.endTime = moment(new Date(new Date(this.customerNewOrder.startTime).getTime() + (30 * 60 * 1000)).toISOString()).locale('es').format();
  }

  //Used to set estimated amount for orders
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

  //Used to get current location of user
  geolocateMe() {
    this.map_drop.search_query = this.userProvider.currentLocation.lat.toFixed(2) + ", " + this.userProvider.currentLocation.lat.toFixed(2);
    this.setDropOrigin(new google.maps.LatLng(this.userProvider.currentLocation.lat, this.userProvider.currentLocation.lng));
    this.map_drop.using_geolocation = true;
    this.getAddress(new google.maps.LatLng(this.userProvider.currentLocation.lat, this.userProvider.currentLocation.lng));
  }

  //set checkbox value
  isChecked(evt) {
    console.log(evt);
    if (evt._value) {
      this.customerNewOrder.isChecked = 1;
    } else {
      this.customerNewOrder.isChecked = 0;
    }
  }

  //used to place an order
  placeOrder() {
    console.log("placeOrder");
    // if (this.map_pick.search_query == "") {
    //    this.alert.okAlertMsg("Choose your pick location!");
    // } else 
    if (this.map_drop.search_query == "") {
      this.alert.okAlertMsg("Choose your drop location!");
    } else if (this.customerNewOrder.estimatedgGoodsPrice == undefined) {
      this.alert.okAlertMsg("Fill estimated price!");
    } else if (this.customerNewOrder.paymentMode == undefined) {
      this.alert.okAlertMsg("Fill payment type!");
    } else if (this.customerNewOrder.orderType == undefined) {
      this.alert.okAlertMsg("Fill Order Type!");
    } else if (this.customerNewOrder.startTime == undefined) {
      this.alert.okAlertMsg("Fill Start Time!");
    } else if (this.customerNewOrder.endTime == undefined) {
      this.alert.okAlertMsg("Fill End Time!");
    } else if (this.customerNewOrder.items.length > 0) {
      for (var y in this.customerNewOrder.items) {
        this.customerNewOrder.items[y].item = UtilsProvider.trim(this.customerNewOrder.items[y].item);
        this.customerNewOrder.items[y].quantity = UtilsProvider.trim(this.customerNewOrder.items[y].quantity);
        if (this.customerNewOrder.items[y].item == "" && this.customerNewOrder.items[y].quantity == "" && this.customerNewOrder.items[y].image == "")
          this.customerNewOrder.items.splice(Number(y), 1);
        else if (this.customerNewOrder.items[y].item == "" && this.customerNewOrder.items[y].quantity == "" && this.customerNewOrder.items[y].image != "") {
          this.alert.okAlertMsg("Fill item name and quantity or delete the image!");
          return;
        }
        else if (this.customerNewOrder.items[y].item != "" && this.customerNewOrder.items[y].quantity == "") {
          this.alert.okAlertMsg("Fill item quantity!");
          return;
        }
        else if (this.customerNewOrder.items[y].item == "" && this.customerNewOrder.items[y].quantity != "") {
          this.alert.okAlertMsg("Fill item name!");
          return;
        }
      }

      if (this.customerNewOrder.items.length == 0) {
        this.alert.okAlertMsg("Fill atleast one item!");
        return;
      }

      if (this.map_pick.search_query != "" && this.customerNewOrder.pickLat == undefined && this.customerNewOrder.pickLong == undefined) {
        this.getLatLongManually(this.map_pick.search_query, "pick");
      }
      if (this.map_drop.search_query != "" && this.customerNewOrder.dropLong == undefined && this.customerNewOrder.dropLong == undefined) {
        this.getLatLongManually(this.map_drop.search_query, "drop");
      } if (this.customerNewOrder.pickLat == undefined && this.customerNewOrder.pickLong == undefined) {
        if (this.map_pick.search_query == "") {

        } else {
          this.customerNewOrder.pickLat = this.map_pick.directions_origin.location.lat();
          this.customerNewOrder.pickLong = this.map_pick.directions_origin.location.lng();
        }

      } if (this.customerNewOrder.dropLong == undefined && this.customerNewOrder.dropLong == undefined) {
        this.customerNewOrder.dropLat = this.map_drop.directions_origin.location.lat();
        this.customerNewOrder.dropLong = this.map_drop.directions_origin.location.lng();
      }
      //comment for demo only
      /*if (this.map_pick.search_query != "") {
              this.utilsProvider.getDistance(this.customerNewOrder.pickLat, this.customerNewOrder.pickLong, this.customerNewOrder.dropLat, this.customerNewOrder.dropLong).then(data => {
                if (this.customerNewOrder.setting.maxDistance > data)
                  this.hitOrderApi();
                else
                  this.alert.okAlertMsg("The distance between the pick up and drop locations exceeds maximum allowed limit.")
              })
            }
            else
       */
      this.hitOrderApi();
    }
  }

  // used for placing new order 
  hitOrderApi() {
    console.log("hitOrderApi");
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader
    loading.present(); //loading present
    var oderInfo: any = {
      category_id: 2, // static
      dropoff_postal_code: this.customerNewOrder.zipcode,
      consumer_id: this.userProvider.user.id,
      consumer_estimated_cost: this.customerNewOrder.estimatedgGoodsPrice,
      dropoff_lat: this.customerNewOrder.dropLat,
      dropoff_lng: this.customerNewOrder.dropLong,
      pickup_lat: this.customerNewOrder.pickLat,
      pickup_lng: this.customerNewOrder.pickLong,
      order_description: this.customerNewOrder.description,
      already_paid: this.customerNewOrder.paymentMode,
      window_start: this.customerNewOrder.startTime,
      window_end: this.customerNewOrder.endTime,
      order_type: this.customerNewOrder.orderType,
      is_alcohol: this.customerNewOrder.isChecked,
      token: this.userProvider.token,
      items: this.customerNewOrder.items,
      secret_codes: this.secretCode ? this.secretCode.toString() : "",
      secret_code_status: this.secretCode ? 1 : 0,
      pickup_address: this.map_pick.search_query,
      dropoff_address: this.map_drop.search_query,
      coupon_code: this.customerNewOrder.couponCode
    }
    console.log("oderInfo");
    console.log(oderInfo);
    this.orderProvider.addOrder(oderInfo).then(data => {
      console.log("this.orderProvider.addOrder success");
      console.log(data);
      console.log("this.secretCode");
      console.log(this.secretCode);
      var d = JSON.parse(JSON.stringify(data));
      if (this.secretCode)
        this.orderProvider.addOrderSecretCodes({
          order_id: d.order_id,
          secret_codes: this.secretCode.toString(),
          user_id: this.userProvider.user.id,
          category_id: 2, // static
          token: this.userProvider.token
        });
      var totalImages = this.customerNewOrder.items.filter(item => item.image != "").length;
      if (totalImages > 0) {
        var uploadImages = 0;
        this.customerNewOrder.items.map((item, index) => {
          console.log("map"); console.log(item); console.log(index);
          if (item.image != "")
            this.orderProvider.uploadOrderImage(d.order_id, d.order_item_ids[index], this.userProvider.token, item.image).then(data => {
              console.log("this.orderProvider.uploadOrderImage success");
              console.log(data);
              ++uploadImages;
              if (totalImages == uploadImages) {
                loading.dismiss(); //loading dismiss
                this.alert.okAlertMsg("Order submitted successfully");
                this.navCtrl.setRoot(CustomerOrderListPage);
              }
            }, err => {
              if(uploadImages != undefined){
                uploadImages = undefined;
                loading.dismiss(); //loading dismiss
                this.alert.okAlertMsg("Order submitted successfully but there is some problem in uploading images");
                this.navCtrl.setRoot(CustomerOrderListPage);
              }
            });
        });
      }
      else {
        loading.dismiss(); //loading dismiss
        this.alert.okAlertMsg("Order submitted successfully");
        this.navCtrl.setRoot(CustomerOrderListPage);
      }
    }, err => {
      console.log("err addOrder")
      console.log(err);
      loading.dismiss(); //loading dismiss
      this.alert.okAlertTitleMsg("Error", err);
    });
  }

  // Used to save new order detail
  saveOrder() {
    console.log("saveOrder")
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader
    loading.present(); //loading present
    if (this.map_drop.directions_origin.location) {
      this.customerNewOrder.dropLat = this.map_drop.directions_origin.location.lat();
      this.customerNewOrder.dropLong = this.map_drop.directions_origin.location.lng();
    }

    for (var y in this.customerNewOrder.items) {
      if (this.customerNewOrder.items[y].item == "" && this.customerNewOrder.items[y].quantity == "" && this.customerNewOrder.items[y].image == "")
        this.customerNewOrder.items.splice(Number(y), 1);
      else if (this.customerNewOrder.items[y].item == "" && this.customerNewOrder.items[y].quantity == "" && this.customerNewOrder.items[y].image != "")
        this.customerNewOrder.items[y].quantity = 1;
      else if (this.customerNewOrder.items[y].item != "" && this.customerNewOrder.items[y].quantity == "")
        this.customerNewOrder.items[y].quantity = 1;
    }

    var oderInfo: any = {
      category_id: 2, // static for deliverable
      status: 5, // static for running orders
      dropoff_postal_code: this.customerNewOrder.zipcode ? this.customerNewOrder.zipcode : 0,
      consumer_id: this.userProvider.user.id,
      consumer_estimated_cost: this.customerNewOrder.estimatedgGoodsPrice ? this.customerNewOrder.estimatedgGoodsPrice : 0,
      dropoff_lat: this.customerNewOrder.dropLat ? this.customerNewOrder.dropLat : 0,
      dropoff_lng: this.customerNewOrder.dropLong ? this.customerNewOrder.dropLong : 0,
      pickup_lat: this.customerNewOrder.pickLat ? this.customerNewOrder.pickLat : "",
      pickup_lng: this.customerNewOrder.pickLong ? this.customerNewOrder.pickLong : "",
      order_description: this.customerNewOrder.description ? this.customerNewOrder.description : "",
      already_paid: this.customerNewOrder.paymentMode ? this.customerNewOrder.paymentMode : 0,
      window_start: this.customerNewOrder.startTime ? this.customerNewOrder.startTime : moment(new Date().toISOString()).locale('es').format(),
      window_end: this.customerNewOrder.endTime ? this.customerNewOrder.endTime : moment(new Date(new Date().getTime() + (30 * 60 * 1000)).toISOString()).locale('es').format(),
      order_type: this.customerNewOrder.orderType ? this.customerNewOrder.orderType : 0,
      is_alcohol: this.customerNewOrder.isChecked ? this.customerNewOrder.isChecked : 0,
      token: this.userProvider.token,
      items: this.customerNewOrder.items,
      secret_codes: this.secretCode ? this.secretCode.toString() : "",
      pickup_address: this.map_pick.search_query ? this.map_pick.search_query : "",
      dropoff_address: this.map_drop.search_query ? this.map_drop.search_query : "",
      coupon_code: this.customerNewOrder.couponCode
    }
    console.log("order info save........................", oderInfo);
    this.orderProvider.addOrder(oderInfo).then(data => {
      console.log("this.orderProvider.addOrder success");
      console.log(data);
      var d = JSON.parse(JSON.stringify(data));
      var totalImages = this.customerNewOrder.items.filter(item => item.image != "").length;
      if (totalImages > 0) {
        var uploadImages = 0;
        this.customerNewOrder.items.map((item, index) => {
          console.log("map"); console.log(item); console.log(index);
          if (item.image != "")
            this.orderProvider.uploadOrderImage(d.order_id, d.order_item_ids[index], this.userProvider.token, item.image).then(data => {
              console.log("this.orderProvider.uploadOrderImage success");
              console.log(data);
              ++uploadImages;
              if (totalImages == uploadImages) {
                loading.dismiss(); //loading dismiss
                this.alert.okAlertMsg("Order saved successfully");
                this.navCtrl.setRoot(CustomerOrderRunningListPage);
              }
            }, err => {
              if(uploadImages){
                uploadImages = undefined;
                loading.dismiss(); //loading dismiss
                this.alert.okAlertMsg("Order saved successfully but there is some problem in uploading images");
                this.navCtrl.setRoot(CustomerOrderRunningListPage);
              }
            });
        });
      }
      else {
        loading.dismiss(); //loading dismiss
        this.alert.okAlertMsg("Order saved successfully");
        this.navCtrl.setRoot(CustomerOrderRunningListPage);
      }
    }, err => {
      console.log("err addOrder")
      console.log(err);
      loading.dismiss(); //loading dismiss
      this.alert.okAlertTitleMsg("Error", err);
    });
  }


  searchPickPlacesPredictions(query: string) {
    let env = this;
    if (query !== "") {
      env.mapProvider.getPlacePredictions(query).subscribe(places_predictions => {
        env.map_pick.search_places_predictions = places_predictions;
      });
    }
    else
      env.map_pick.search_places_predictions = [];
  }

  // used to set the order pick location 
  setPickOrigin(location: google.maps.LatLng) {
    console.log("setPickOrigin");
    console.log(location.lat());
    console.log(location.lng());
    let env = this;

    // Clean map
    env.map_pick.cleanSearch();

    // Set the origin for later directions
    env.map_pick.directions_origin.location = location;
  }

  selectPickSearchResult(place: google.maps.places.AutocompletePrediction) {
    let env = this;

    env.map_pick.search_query = place.description;
    env.map_pick.search_places_predictions = [];

    // We need to get the location from this place. Let's geocode this place!
    env.mapProvider.geocodePlace(place.place_id).subscribe(place_location => {
      env.setPickOrigin(place_location);
    });
  }

  clearPickSearch() {
    this.map_pick.cleanSearch();
  }

  // Used to get the complete address through latlong

  getAddress(latLng) {
    let env = this;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latLng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          // Formatted address
          env.map_drop.search_query = results[0].formatted_address;
        }
      }
    })
  }

  //used to search drop location 
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

  // Used to set drop location 
  setDropOrigin(location: google.maps.LatLng) {
    console.log(location);
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
      //comment for demo only
      //      this.getCheckOrderCreateSettings(location.lat(), location.lng());
    }, err => {
      console.log("err getZipCode")
      console.log(err)
    });
  }

  //used to select drop location from searching result
  selectDropSearchResult(place: google.maps.places.AutocompletePrediction) {
    let env = this;

    env.map_drop.search_query = place.description;
    env.map_drop.search_places_predictions = [];

    // We need to get the location from this place. Let's geocode this place!
    env.mapProvider.geocodePlace(place.place_id).subscribe(place_location => {
      env.setDropOrigin(place_location);
    });
  }

  //used for clear map drop search 
  clearDropSearch() {
    this.map_drop.cleanSearch();
    this.map_drop.using_geolocation = false;
  }

  public presentActionSheet(item) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, item);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, item);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  // Create options for the Camera Dialog
  public takePicture(sourceType, item) {
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), item);
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), item);
      }
    }, (err) => {
      this.presentToast('Error while selecting image');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName, item) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      item.image = cordova.file.dataDirectory + newFileName;
      console.log(this.customerNewOrder.items);
    }, error => {
      this.presentToast('Error while storing file');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  focusFunction() {
    // alert("hello");
  }
  hidePickAutoComplete(env) {
    console.log("hide autocomplete 1");
    this.map_pick.search_places_predictions = [];
  }


  hideDropAutoComplete(env) {
    console.log("hide autocomplete 2");
    this.map_drop.search_places_predictions = [];
  }

  // find  lat long when manually add location
  getLatLongManually(address, pick_drop) {
    console.log("getLatLongManually");
    var env = this;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

        if (pick_drop == "pick") {
          console.log("pick location : " + results[0].geometry.location.lat() + " " + results[0].geometry.location.lng());
          env.customerNewOrder.pickLat = results[0].geometry.location.lat();
          env.customerNewOrder.pickLong = results[0].geometry.location.lng();

        } else {
          console.log("drop location : " + results[0].geometry.location.lat() + " " + results[0].geometry.location.lng());
          env.customerNewOrder.dropLat = results[0].geometry.location.lat();
          env.customerNewOrder.dropLong = results[0].geometry.location.lng();
          env.utilsProvider.getZipCode(results[0].geometry.location.lat(), results[0].geometry.location.lng()).then(data => {
            console.log("this.orderProvider.getZipCode success");
            console.log(data);
            env.customerNewOrder.zipcode = data;
            //comment for demo only
            //      env.getCheckOrderCreateSettings(results[0].geometry.location.lat(), results[0].geometry.location.lng());
          }, err => {
            console.log("err getZipCode")
            console.log(err)
          });
        }

      } else {
        console.log("Something got wrong " + status);
      }
    });
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
      console.log(JSON.stringify(response));
      let res = JSON.parse(JSON.stringify(response))
      let h = {};
      for (let d of res.data) { h[d.settings_name] = d.settings_value; }
      console.log("h")
      console.log(h)
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
      if (this.customerNewOrder.setting.onDemand && this.customerNewOrder.setting.resting) {
        this.alert.okAlertTitleMsg("Error", "Once ordering is enabled near you, we will notify you via the app, email, or text.");
        this.customerNewOrder.orderType = undefined;
      }
      else if (this.customerNewOrder.orderType == 0 && this.customerNewOrder.setting.onDemand) {
        this.alert.okAlertTitleMsg("Error", "Currently On Demand order is not avialable.");
        this.customerNewOrder.orderType = 1;
      }
      else if (this.customerNewOrder.orderType == 1 && this.customerNewOrder.setting.resting) {
        this.alert.okAlertTitleMsg("Error", "Currently Resting order is not avialable.");
        this.customerNewOrder.orderType = 0;
      }
      if (this.customerNewOrder.startTime) {
        let timeDifference = this.utilsProvider.getTimeDiffernce(this.customerNewOrder.startTime, this.customerNewOrder.maxStart)
        if (timeDifference <= 0)
          this.alert.okAlertTitleMsg("Error", "Not allowed in this time frame.");
      }
      console.log("this.customerNewOrder");
      console.log(this.customerNewOrder);
    }, (err) => {
      this.alert.okAlertMsg("We will serve your location soon. Please check Peers It periodically or request that we activate in your city ASAP.");
    });
  }

  addCoupon() {
    this.showCoupon = false;
  }

  cancelCoupon() {
    this.showCoupon = true;
    this.couponCode = "";
  }

  applyCoupon() {
    this.orderProvider.verifyCoupon(this.couponCode).then(data => {
      this.alert.okAlertMsg('Coupon applied Successfully!')
      this.customerNewOrder.couponCode = this.couponCode;
    }, err => {
      this.alert.okAlertTitleMsg('Error', 'Coupon entered is Invalid.')
      this.couponCode = "";
    });
  }

  deleteItem(index) {
    console.log("deleteItem");
    this.customerNewOrder.items.splice(index, 1);
    if (this.customerNewOrder.items.length == 0)
      this.customerNewOrder.items.push({ item: "", quantity: "", image: "" });
  }
}
