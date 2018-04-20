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

import { Api } from '../../providers/api/api';
import { MapProvider } from '../../providers/map/map';
import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
import { MapsModel, MapPlace } from '../../providers/map/maps.model';
import { AlertProvider } from '../../providers/alert/alert';

import { CustomerEditOrderModel } from './customer-edit-order.model';
import { CustomerOrderListPage } from '../customer-order-list/customer-order-list';
import { Push } from '@ionic-native/push';

/**
 * Generated class for the customerEditOrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var cordova: any;
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-customer-edit-order',
  templateUrl: 'customer-edit-order.html',
})
export class CustomerEditOrderPage {
  @ViewChild(Content) content: Content;
  customerSecretCode: any = [];
  status: any;

  map_pick: MapsModel = new MapsModel();
  map_drop: MapsModel = new MapsModel();

  lastImage: string = null;
  loading: Loading;
  secretCode: any;
  couponCode: any = "";
  showCoupon: boolean = true;

  customerEditOrder: CustomerEditOrderModel = new CustomerEditOrderModel();
  constructor(
    public navCtrl: NavController,
    private viewCtrl: ViewController,
    public navParams: NavParams,
    public geolocation: Geolocation,
    public api: Api,
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

    this.getOrderDetails(this.navParams.get('orderId'));
    this.status = this.navParams.get('status');
    if (this.userProvider.settings.consumer_order_type == 2 && this.status == 1)
      this.getSecretCode();
  }

  // Used to get secret code 
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
    console.log('ionViewDidLoad customerEditOrderPage');
  }

  // add new item
  addItem() {
    this.customerEditOrder.items.push({ item: "", quantity: "", image: "", id: "" })
    this.content.scrollToBottom();
  }

  // set End time minimum 30 mins more than start time
  setEndTime() {
    this.customerEditOrder.endTime = moment(new Date(new Date(this.customerEditOrder.startTime).getTime() + (30 * 60 * 1000)).toISOString()).locale('es').format();
  }

  // set estimated amount of an order 
  setEstimatedAmount(evt) {
    if (evt == 1) {
      this.customerEditOrder.estimatedgGoodsPrice = 0;
    }

  }
  // set order time & date time check
  orderTypeChange(evt) {
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

  //Used to get the current location of the user
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
      this.customerEditOrder.isChecked = 1;
    } else {
      this.customerEditOrder.isChecked = 0;
    }
  }

  // placing customer order
  placeOrder() {
    debugger;
    console.log("placeOrder");
    console.log(this.customerEditOrder);
    if (this.map_drop.search_query == "") {
      this.alert.okAlertMsg("Choose your drop location!");
    } else if (this.customerEditOrder.estimatedgGoodsPrice == undefined) {
      this.alert.okAlertMsg("Fill estimated price!");
    } else if (this.customerEditOrder.paymentMode == undefined) {
      this.alert.okAlertMsg("Fill payment type!");
    } else if (this.customerEditOrder.orderType == undefined) {
      this.alert.okAlertMsg("Fill Order Type!");
    } else if (this.customerEditOrder.startTime == undefined) {
      this.alert.okAlertMsg("Fill Start Time!");
    } else if (this.customerEditOrder.endTime == undefined) {
      this.alert.okAlertMsg("Fill End Time!");
    } else if (this.customerEditOrder.items.length > 0) {
      for (var y in this.customerEditOrder.items) {
        this.customerEditOrder.items[y].item = UtilsProvider.trim(this.customerEditOrder.items[y].item);
        this.customerEditOrder.items[y].quantity = UtilsProvider.trim(this.customerEditOrder.items[y].quantity);
        if (this.customerEditOrder.items[y].item == "" && this.customerEditOrder.items[y].quantity == "" && this.customerEditOrder.items[y].image == "")
          this.customerEditOrder.items.splice(Number(y), 1);
        else if (this.customerEditOrder.items[y].item == "" && this.customerEditOrder.items[y].quantity == "" && this.customerEditOrder.items[y].image != "") {
          this.alert.okAlertMsg("Fill item name and quantity or delete the image!");
          return;
        }
        else if (this.customerEditOrder.items[y].item != "" && this.customerEditOrder.items[y].quantity == "") {
          this.alert.okAlertMsg("Fill item quantity!");
          return;
        }
        else if (this.customerEditOrder.items[y].item == "" && this.customerEditOrder.items[y].quantity != "") {
          this.alert.okAlertMsg("Fill item name!");
          return;
        }
      }

      if (this.customerEditOrder.items.length == 0) {
        this.customerEditOrder.items.push({ item: "", quantity: "", image: "" });
        this.alert.okAlertMsg("Fill atleast one item!");
        return;
      }

      if (this.map_pick.search_query != "" && this.customerEditOrder.pickLat == undefined && this.customerEditOrder.pickLong == undefined) {
        this.getLatLongManually(this.map_pick.search_query, "pick");
      }
      if (this.map_drop.search_query != "" && this.customerEditOrder.dropLong == undefined && this.customerEditOrder.dropLong == undefined) {
        this.getLatLongManually(this.map_drop.search_query, "drop");
      } if (this.customerEditOrder.pickLat == undefined && this.customerEditOrder.pickLong == undefined) {
        if (this.map_pick.search_query == "") {

        } else {
          this.customerEditOrder.pickLat = this.map_pick.directions_origin.location.lat();
          this.customerEditOrder.pickLong = this.map_pick.directions_origin.location.lng();
        }

      } if (this.customerEditOrder.dropLong == undefined && this.customerEditOrder.dropLong == undefined) {
        this.customerEditOrder.dropLat = this.map_drop.directions_origin.location.lat();
        this.customerEditOrder.dropLong = this.map_drop.directions_origin.location.lng();
      }
      //comment for demo only
      /*if (this.map_pick.search_query != "" && this.status != 1)
              this.utilsProvider.getDistance(this.customerEditOrder.pickLat, this.customerEditOrder.pickLong, this.customerEditOrder.dropLat, this.customerEditOrder.dropLong).then(data => {
                if (this.customerEditOrder.setting.maxDistance > data)
                  this.hitOrderApi();
                else
                  this.alert.okAlertMsg("The distance between the pick up and drop locations exceeds maximum allowed limit.")
              })
            else */
      this.hitOrderApi();
    }
  }

  //Used for order api 
  hitOrderApi() {
    console.log("hitOrderApi");
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader
    loading.present(); //loading present
    var oderInfo: any = {
      category_id: 2, // static
      dropoff_postal_code: this.customerEditOrder.zipcode,
      consumer_id: this.userProvider.user.id,
      consumer_estimated_cost: this.customerEditOrder.estimatedgGoodsPrice,
      dropoff_lat: this.customerEditOrder.dropLat,
      dropoff_lng: this.customerEditOrder.dropLong,
      pickup_lat: this.customerEditOrder.pickLat,
      pickup_lng: this.customerEditOrder.pickLong,
      order_description: this.customerEditOrder.description,
      already_paid: this.customerEditOrder.paymentMode,
      window_start: this.customerEditOrder.startTime,
      window_end: this.customerEditOrder.endTime,
      order_type: this.customerEditOrder.orderType,
      is_alcohol: this.customerEditOrder.isChecked,
      token: this.userProvider.token,
      pickup_address: this.map_pick.search_query,
      dropoff_address: this.map_drop.search_query,
      coupon_code: this.customerEditOrder.couponCode
    }

    if (this.status == 1) {
      var items = this.customerEditOrder.items;
      items.map(item => delete item.id)
      oderInfo.secret_code_status = this.secretCode ? 1 : 0;
      oderInfo.secret_codes = this.secretCode ? this.secretCode.toString() : "";
      oderInfo.items = items;
      console.log(oderInfo);
      this.orderProvider.addOrder(oderInfo).then(data => {
        this.orderProvider.permanentDeleteOrder(this.navParams.get('orderId'));
        console.log("this.orderProvider.addOrder success");
        console.log(data);
        var d = JSON.parse(JSON.stringify(data));
        if (this.secretCode)
          this.orderProvider.addOrderSecretCodes({
            order_id: d.order_id,
            secret_codes: this.secretCode.toString(),
            user_id: this.userProvider.user.id,
            category_id: 2, // static
            token: this.userProvider.token
          });
        var totalImages = this.customerEditOrder.items.filter(item => item.image != "" && !item.image.startsWith('http')).length;
        if (this.customerEditOrder.items.length - totalImages > 0) {
          var orderInfo = [];
          d.order_item_ids.map((id, index) => {
            if (this.customerEditOrder.items[index].image != "")
              orderInfo.push({ item_id: id, item_image: this.customerEditOrder.items[index].image });
            if (index == d.order_item_ids.length - 1)
              this.orderProvider.updateDraftOrderImages(orderInfo);
          });
        }
        if (totalImages > 0) {
          var uploadImages = 0;
          this.customerEditOrder.items.map((item, index) => {
            console.log("map"); console.log(item); console.log(index);
            if (item.image != "" && !item.image.startsWith('http'))
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
                if (uploadImages) {
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
    else {
      oderInfo.supplier_id = this.customerEditOrder.supplierId;
      oderInfo.order_id = this.navParams.get('orderId');
      oderInfo.items = this.customerEditOrder.items;
      console.log(oderInfo);
      this.orderProvider.editOrder(oderInfo).then(data => {
        console.log("this.orderProvider.addOrder success");
        console.log(data);
        var d = JSON.parse(JSON.stringify(data));
        var totalImages = this.customerEditOrder.items.filter(item => item.image != "" && !item.image.startsWith('http')).length;
        if (totalImages > 0) {
          var uploadImages = 0;
          this.customerEditOrder.items.map((item, index) => {
            console.log("map"); console.log(item); console.log(index);
            if (item.image != "" && !item.image.startsWith('http'))
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
                if (uploadImages) {
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

  }


  //Used to save edit order detail
  saveOrder() {
    console.log("saveOrder")
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader
    loading.present(); //loading present

    if (this.map_drop.directions_origin.location) {
      this.customerEditOrder.dropLat = this.map_drop.directions_origin.location.lat();
      this.customerEditOrder.dropLong = this.map_drop.directions_origin.location.lng();
    }

    for (var y in this.customerEditOrder.items) {
      if (this.customerEditOrder.items[y].item == "" && this.customerEditOrder.items[y].quantity == "" && this.customerEditOrder.items[y].image == "")
        this.customerEditOrder.items.splice(Number(y), 1);
      else if (this.customerEditOrder.items[y].item == "" && this.customerEditOrder.items[y].quantity == "" && this.customerEditOrder.items[y].image != "")
        this.customerEditOrder.items[y].quantity = 1;
      else if (this.customerEditOrder.items[y].item != "" && this.customerEditOrder.items[y].quantity == "")
        this.customerEditOrder.items[y].quantity = 1;
    }

    var oderInfo: any = {
      supplier_id: this.customerEditOrder.supplierId,
      order_id: this.navParams.get('orderId'),
      category_id: 2, // static
      status: 5, // static
      dropoff_postal_code: this.customerEditOrder.zipcode ? this.customerEditOrder.zipcode : "",
      consumer_id: this.userProvider.user.id,
      consumer_estimated_cost: this.customerEditOrder.estimatedgGoodsPrice ? this.customerEditOrder.estimatedgGoodsPrice : 0,
      dropoff_lat: this.customerEditOrder.dropLat ? this.customerEditOrder.dropLat : "",
      dropoff_lng: this.customerEditOrder.dropLong ? this.customerEditOrder.dropLong : "",
      pickup_lat: this.customerEditOrder.pickLat ? this.customerEditOrder.pickLat : "",
      pickup_lng: this.customerEditOrder.pickLong ? this.customerEditOrder.pickLong : "",
      order_description: this.customerEditOrder.description ? this.customerEditOrder.description : "",
      already_paid: this.customerEditOrder.paymentMode ? this.customerEditOrder.paymentMode : 0,
      window_start: this.customerEditOrder.startTime ? this.customerEditOrder.startTime : moment(new Date().toISOString()).locale('es').format(),
      window_end: this.customerEditOrder.endTime ? this.customerEditOrder.endTime : moment(new Date(new Date(this.customerEditOrder.startTime).getTime() + (30 * 60 * 1000)).toISOString()).locale('es').format(),
      order_type: this.customerEditOrder.orderType ? this.customerEditOrder.orderType : 0,
      is_alcohol: this.customerEditOrder.isChecked ? this.customerEditOrder.isChecked : 0,
      token: this.userProvider.token,
      items: this.customerEditOrder.items,
      secret_codes: this.secretCode ? this.secretCode.toString() : "",
      pickup_address: this.map_pick.search_query ? this.map_pick.search_query : "",
      dropoff_address: this.map_drop.search_query ? this.map_drop.search_query : "",
      coupon_code: this.customerEditOrder.couponCode ? this.customerEditOrder.couponCode : ""
    }
    console.log(oderInfo);
    this.orderProvider.editOrder(oderInfo).then(data => {
      console.log("this.orderProvider.addOrder success");
      console.log(data);
      var d = JSON.parse(JSON.stringify(data));
      var totalImages = this.customerEditOrder.items.filter(item => item.image != "" && !item.image.startsWith('http')).length;
      if (totalImages > 0) {
        var uploadImages = 0;
        this.customerEditOrder.items.map((item, index) => {
          console.log("map"); console.log(item); console.log(index);
          if (item.image != "" && !item.image.startsWith('http'))
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
              if (uploadImages) {
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
      console.log("addOrder err")
      console.log(err);
      loading.dismiss(); //loading dismiss
      this.alert.okAlertTitleMsg("Error", err);
    });
  }

  //used to get pick location options 
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

  // set the pick location 
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

  // used for selecting best option from predictions
  selectPickSearchResult(place: google.maps.places.AutocompletePrediction) {
    let env = this;

    env.map_pick.search_query = place.description;
    env.map_pick.search_places_predictions = [];

    // We need to get the location from this place. Let's geocode this place!
    env.mapProvider.geocodePlace(place.place_id).subscribe(place_location => {
      env.setPickOrigin(place_location);
    });
  }

  // clean map in case of pick search 
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

  //search drop location predictions
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

  // Set  for drop origin location 
  setDropOrigin(location: google.maps.LatLng) {
    console.log("setDropOrigin");
    console.log(location.lat());
    console.log(location.lng());

    // Clean map
    this.map_drop.cleanSearch();

    // Set the origin for later directions
    this.map_drop.directions_origin.location = location;
    this.utilsProvider.getZipCode(location.lat(), location.lng()).then(data => {
      console.log("this.orderProvider.getZipCode success");
      console.log(data);
      this.customerEditOrder.zipcode = data;
      //comment for demo only
/*       if (this.status != 1)
        this.getCheckOrderCreateSettings(location.lat(), location.lng());
 */    }, err => {
        console.log("err getZipCode")
        console.log(err)
      });
  }

  //select drop location from the given predications
  selectDropSearchResult(place: google.maps.places.AutocompletePrediction) {
    let env = this;

    env.map_drop.search_query = place.description;
    env.map_drop.search_places_predictions = [];

    // We need to get the location from this place. Let's geocode this place!
    env.mapProvider.geocodePlace(place.place_id).subscribe(place_location => {
      env.setDropOrigin(place_location);
    });
  }

  //for clear drop search location
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
      console.log(this.customerEditOrder.items);
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
          env.customerEditOrder.pickLat = results[0].geometry.location.lat();
          env.customerEditOrder.pickLong = results[0].geometry.location.lng();

        } else {
          console.log("drop location : " + results[0].geometry.location.lat() + " " + results[0].geometry.location.lng());
          env.customerEditOrder.dropLat = results[0].geometry.location.lat();
          env.customerEditOrder.dropLong = results[0].geometry.location.lng();
          env.utilsProvider.getZipCode(results[0].geometry.location.lat(), results[0].geometry.location.lng()).then(data => {
            console.log("this.orderProvider.getZipCode success");
            console.log(data);
            env.customerEditOrder.zipcode = data;
      //comment for demo only
/*             if (env.status != 1)
              env.getCheckOrderCreateSettings(results[0].geometry.location.lat(), results[0].geometry.location.lng());
 */          }, err => {
              console.log("err getZipCode")
              console.log(err)
            });
        }

      } else {
        console.log("Something got wrong " + status);
      }
    });
  }

  // Used to get order details
  getOrderDetails(orderId) {
    debugger;
    console.log("getOrderDetails")
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader create
    loading.present();// loading present
    this.orderProvider.getOrderDetails(orderId).then(data => {
      var od = JSON.parse(JSON.stringify(data));
      console.log(od.order_details.length);
      od.order_details.map(item => {
        item.quantity = "" + item.quantity;
        item.image = item.image ? this.api.imageUrl + item.image : "";
      });

      if (od.order_details.length != 0) {
        this.customerEditOrder.items = od.order_details;
      } else {
        this.customerEditOrder.items.push({ item: "", quantity: "", image: "" });
      }

      this.customerEditOrder.description = od.order_description;
      this.customerEditOrder.estimatedgGoodsPrice = od.consumer_estimated_cost;
      this.customerEditOrder.paymentMode = od.already_paid;
      this.customerEditOrder.startTime = od.window_start;
      this.customerEditOrder.endTime = od.window_end;
      this.customerEditOrder.isChecked = od.is_alcohol;
      this.customerEditOrder.orderType = od.order_type;
      this.customerEditOrder.zipcode = od.dropoff_postal_code;
      this.customerEditOrder.couponCode = od.coupon_code;
      this.couponCode = od.coupon_code;
      //      this.customerEditOrder.using_geolocation:boolean = false;
      this.customerEditOrder.dropLat = od.dropoff_lat;
      console.log("Customer edit order...................", this.customerEditOrder);
      this.customerEditOrder.dropLong = od.dropoff_lng;
      this.map_drop.search_query = od.dropoff_address;
      if (od.supplier_id)
        this.customerEditOrder.supplierId = od.supplier_id;
      if (od.pickup_address != "") {
        this.map_pick.search_query = od.pickup_address;
        this.customerEditOrder.pickLat = od.pickup_lat;
        this.customerEditOrder.pickLong = od.pickup_lng;
      }
      if (this.status == 1) {
        if (this.utilsProvider.getTimeDiffernce(od.window_start, moment(new Date().toISOString()).locale('es').format()) > 0) {
          this.customerEditOrder.startTime = moment(new Date().toISOString()).locale('es').format();
          if (this.customerEditOrder.orderType == 1)
            this.customerEditOrder.endTime = moment(new Date(new Date(this.customerEditOrder.startTime).getTime() + (60 * 60 * 1000)).toISOString()).locale('es').format();
          else
            this.customerEditOrder.endTime = moment(new Date(new Date(this.customerEditOrder.startTime).getTime() + (30 * 60 * 1000)).toISOString()).locale('es').format();
        }
      }
      loading.dismiss(); // loading dismiss
    }, err => {
      loading.dismiss(); // loading dismiss
      console.log("getOrderDetails err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
      //      this.navCtrl.pop();
    })
  }


  getCheckOrderCreateSettings(lat, lng) {
    console.log("getCheckOrderCreateSettings");
    var orderSettings = {
      pcode: this.customerEditOrder.zipcode,
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
          this.customerEditOrder.setting.onDemand = d.settings_value == 1 ? false : true;
        else if (d.settings_name == "resting_deliv_status")
          this.customerEditOrder.setting.resting = d.settings_value == 1 ? false : true;
        else if (d.settings_name == "max_allowed_days_option") {
          if (h["resting_allowed_days"])
            switch (d.settings_value) {
              case "Days":
                this.customerEditOrder.maxStart = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * parseInt(h["resting_allowed_days"]))).toISOString();
                break;
              case "Months":
                this.customerEditOrder.maxStart = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30 * parseInt(h["resting_allowed_days"]))).toISOString();
                break;
              case "Years":
                this.customerEditOrder.maxStart = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365 * parseInt(h["resting_allowed_days"]))).toISOString();
                break;
            }
        }
      }
      console.log("resting_min_suppliers test")
      console.log(h["resting_min_suppliers"])
      console.log(res.resting_sup)
      console.log(h["resting_min_suppliers"] < res.resting_sup)
      if (!this.customerEditOrder.setting.resting && h["resting_min_suppliers"] <= res.resting_sup)
        this.customerEditOrder.setting.resting = false;
      else
        this.customerEditOrder.setting.resting = true;
      if (!this.customerEditOrder.setting.onDemand && h["on_demand_min_suppliers"] <= res.on_demand_sup)
        this.customerEditOrder.setting.onDemand = false;
      else
        this.customerEditOrder.setting.onDemand = true;
      if (this.customerEditOrder.setting.onDemand && this.customerEditOrder.setting.resting) {
        this.alert.okAlertTitleMsg("Error", "Once ordering is enabled near you, we will notify you via the app, email, or text.");
        this.customerEditOrder.orderType = undefined;
      }
      else if (this.customerEditOrder.orderType == 0 && this.customerEditOrder.setting.onDemand) {
        this.alert.okAlertTitleMsg("Error", "Currently On Demand order is not avialable.");
        this.customerEditOrder.orderType = 1;
      }
      else if (this.customerEditOrder.orderType == 1 && this.customerEditOrder.setting.resting) {
        this.alert.okAlertTitleMsg("Error", "Currently Resting order is not avialable.");
        this.customerEditOrder.orderType = 0;
      }
      if (this.customerEditOrder.startTime) {
        let timeDifference = this.utilsProvider.getTimeDiffernce(this.customerEditOrder.startTime, this.customerEditOrder.maxStart)
        if (timeDifference <= 0)
          this.alert.okAlertTitleMsg("Error", "Not allowed in this time frame.");
      }
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
      this.customerEditOrder.couponCode = this.couponCode;
    }, err => {
      this.alert.okAlertTitleMsg('Error', 'Coupon entered is Invalid.')
      this.couponCode = "";
    });
  }

  deleteImage(item) {
    if (item.image.startsWith('http'))
      this.orderProvider.deleteOrderImages({
        order_id: this.navParams.get('orderId'),
        image_name: item.image.replace(this.api.imageUrl, ""),
        token: this.userProvider.token
      });
    item.image = "";
  }

  deleteItem(index) {
    console.log("deleteItem");
    if (this.customerEditOrder.items[index].id != "")
      this.orderProvider.deleteOrderItem({
        order_detail_id: this.customerEditOrder.items[index].id,
        image_name: this.customerEditOrder.items[index].image, //(filename) - [optional]
        token: this.userProvider.token
      })
    this.customerEditOrder.items.splice(index, 1);
    if (this.customerEditOrder.items.length == 0)
      this.customerEditOrder.items.push({ item: "", quantity: "", image: "", id: "" });
  }

}
