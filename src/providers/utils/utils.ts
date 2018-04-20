import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import moment from 'moment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Api } from '../api/api';
import { UserProvider } from '../user/user';
import { MapProvider } from '../../providers/map/map';

/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  //month names
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  //states
  stateNames = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
  ];

  //service provider default settings
  serviceSettings = {
    service_on_demand_orders: 1,
    service_resting_orders: 0,
    service_push_notifications: 1,
    service_mute: 0,
    service_secret_code: 0,
    service_regular_orders: 1,
    service_order_type: 4,
    service_delivery_raduis: 5,
    service_provide_from: 4,
    service_order_gender: 3,
    service_accepting_orders: 0,
    //    service_order_window_start: new Date().toLocaleTimeString(),
    //    service_order_window_end: new Date().toLocaleTimeString(),
    service_order_window_start: '00:00',
    service_order_window_end: '23:59',
    service_order_mode: 3,
    service_cap: 0,
    service_cap_amount: 0,
    service_cap_day: 0,
    service_is_atm: 1,
    service_min_atm: 5,
    service_max_atm: 40,
    service_is_age: 0,
    service_age_lower: 18,
    service_age_upper: 60
  }

  //customer default settings
  customerSettings = {
    consumer_push_notifications: 1,
    consumer_order_type: 4,
    consumer_preferred_orders: 3,
    consumer_order_time: 5,
    consumer_contact_priority: 3,
    consumer_order_mode: 3
  }

  //service provider default filters
  orderFilter = {
    sort_type: 0,
    category_id: 3,
    order_loc: 0,
    order_type: 2,
    sort_column: "distance",
    radius: 5,
  };

  constructor(
    public http: Http,
    public api: Api,
    public userProvider: UserProvider,
    public mapProvider: MapProvider,
    public geolocation: Geolocation
  ) {
    console.log('Hello UtilsProvider Provider');
  }

  static trim(str) {
    if (typeof str == "string")
      return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    else
      return "";
  }

  //Use to get the zipcode through lat long
  getZipCode(lat, long) {
    console.log("getZipCode");
    console.log(lat, long);
    return new Promise((resolve, reject) => {
      this.api.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&sensor=true`).map(res => res.json()).subscribe(res => {
        console.log('getZipCode res');
        console.log(res);
        if (res.status == "OK")
          resolve(this.processZipCode(res.results));
        else
          reject(res);
      }, err => {
        console.log('getZipCode err');
        console.log(err);
        if (err.msg)
          reject(err);
        else
          reject({ msg: "Server not responding" })
      });
    });
  }

  //Use to get the County Name through lat long
  getCountyName(lat, long) {
    console.log("getCountyName");
    console.log(lat, long);
    return new Promise((resolve, reject) => {
      this.api.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&sensor=true`).map(res => res.json()).subscribe(res => {
        console.log('getCountyName res');
        console.log(res);
        if (res.status == "OK")
          resolve(this.processCountyName(res.results));
        else
          resolve("");
      }, err => {
        console.log('getCountyName err');
        console.log(err);
        resolve("");
      });
    });
  }

  //used to get a zipcode for a corresponding address
  processZipCode(addresses) {
    for (var x of addresses) {
      for (var y of x.address_components) {
        for (var z of y.types) {
          if (z == "postal_code")
            return y.long_name;
        }
      }
    }
  }

  //used to get a County Name for a corresponding address
  processCountyName(addresses) {
    for (var x of addresses) {
      for (var y of x.address_components) {
        if (y.long_name.includes("County"))
          return y.long_name;
      }
      var otherCounty = ["East Carroll Parish","Madison Parish","Tensas Parish","Norton city","Evangeline Parish","Concordia Parish","Franklin Parish","Richland Parish","Danville city","Washington Parish","Martinsville city","West Carroll Parish","Natchitoches Parish","Galax city","Winn Parish","Catahoula Parish","Claiborne Parish","Bienville Parish","Red River Parish","Morehouse Parish","St. Landry Parish","Avoyelles Parish","Wade Hampton Census Area","St. Helena Parish","Emporia city","Bristol city","Yukon-Koyukuk Census Area","St. Louis city","Caldwell Parish","Sabine Parish","Petersburg city","Radford city","Union Parish","Covington city","Webster Parish","Jackson Parish","Caddo Parish","Bedford city","Lincoln Parish","Richmond city","Roanoke city","Orleans Parish","De Soto Parish","West Virginia","St. Martin Parish","Mississippi","Franklin city","Acadia Parish","Jefferson Davis Parish","Iberville Parish","Arkansas","Grant Parish","La Salle Parish","Harrisonburg city","Ouachita Parish","St. Bernard Parish","East Feliciana Parish","Pointe Coupee Parish","Buena Vista city","Lynchburg city","Lexington city","Tangipahoa Parish","St. Mary Parish"," alls Church city","Fairfax city","Alexandria city","Poquoson city","Anchorage Borough","North Slope Borough","Matanuska-Susitna Borough","Juneau Borough","Denali Borough","Maryland","New Jersey","Manassas Park city","Manassas city","Connecticut","Alaska","Bristol Bay Borough","Chesapeake city","Hawaii","Fairbanks North Star Borough","Massachusetts","Virginia Beach city","New Hampshire","Aleutians West Census Area","Kodiak Island Borough","Sitka Borough","Ascension Parish","Virginia","Skagway Municipality","California","Southeast Fairbanks Census Area","Valdez-Cordova Census Area","Ketchikan Gateway Borough","District of Columbia","Delaware","Washington","Northwest Arctic Borough","Suffolk city","Minnesota","Colorado","St. Tammany Parish","St. Charles Parish","Utah","Nevada","Illinois","New York","Wyoming","Rhode Island","Yakutat Borough","Wrangell-Petersburg Census Area","Kenai Peninsula Borough","Livingston Parish","Aleutians East Borough","Vermont","Wisconsin","United States","Colonial Heights city","Carson City","Arizona","Plaquemines Parish","Georgia","Dillingham Census Area","Pennsylvania","Williamsburg city","Kansas","Oregon","West Feliciana Parish","Texas","Cameron Parish","Terrebonne Parish","Nebraska","St. John the Baptist Parish","Bossier Parish","Lafourche Parish","Iowa","Newport News city","Michigan","Haines Borough","Lafayette Parish","Ohio","Indiana","Florida","Idaho","Hampton city","Jefferson Parish","Nome Census Area","Missouri","Winchester city","North Carolina","East Baton Rouge Parish","Maine","South Dakota","North Dakota","Salem city","Fredericksburg city","St. James Parish","Portsmouth city","West Baton Rouge Parish","Calcasieu Parish","South Carolina","Prince of Wales-Outer Ketchikan Census Area","Hoonah-Angoon Census Area","Montana","New Mexico","Lake and Peninsula Borough","Louisiana","Tennessee","Beauregard Parish","Charlottesville city","Oklahoma","Staunton city","Alabama","Bethel Census Area","Kentucky","Vermilion Parish","Assumption Parish","Vernon Parish","Rapides Parish","Waynesboro city","Iberia Parish","Hopewell city","Norfolk city","Allen Parish","Baltimore city"];
      for (var o of otherCounty) {
        for (var y of x.address_components) {
          if (y.long_name == o)
            return y.long_name;
        }
      }
      return "";
    }
  }

  // Use for prepare the customer order detail
  prepareOrderDetails(data) {
    var orders = [];
    for (var i in data) {
      orders.push({
        id: data[i].id,
        subject: data[i].order_details,
        customerEstCost: data[i].consumer_estimated_cost,
        day: new Date(data[i].window_start).getDate(),
        monthName: this.monthNames[new Date(data[i].window_start).getMonth()],
        year: new Date(data[i].window_start).getFullYear(),
        startTime: moment.utc(data[i].window_start).format("hh:mm A"),
        endTime: moment.utc(data[i].window_end).format("hh:mm A"),
        pictures: data[i].image_details,
        description: data[i].order_description,
        receiptCode: data[i].receipt_code,
        mobile_no: data[i].mobile_no,
        consumer_id: data[i].consumer_id,
        supplier_id: data[i].supplier_id,
        orderType: data[i].order_type,
        categoryId: data[i].category_id,
        totalCost: data[i].total_cost,
        createdDate: data[i].date,
        dropoff_lat: data[i].dropoff_lat,
        dropoff_lng: data[i].dropoff_lng,
        zipcode: data[i].dropoff_postal_code,
        couponCode: data[i].coupon_code
      });

      if (data[i].pickup_address != null || data[i].pickup_address != '')
        orders[i].pickLocation = data[i].pickup_address;

      if (data[i].dropoff_address != null || data[i].dropoff_address != '')
        orders[i].dropLocation = data[i].dropoff_address;
    }
    return orders;
  }

  //Use for get current location 
  watchPosition() {
    console.log("watchPosition")
    this.geolocation.watchPosition().subscribe(position => {
      this.userProvider.currentLocation.lat = position.coords.latitude;
      this.userProvider.currentLocation.lng = position.coords.longitude;
      console.log(this.userProvider.currentLocation.lat)
    }, err => {
      console.log('Error getting location', err);
    });
  }

  // Use for find the Time difference between two time stamp
  showEdit(testTime) {
    var currenttime = moment(new Date().toISOString()).locale('es').format();
    var a = moment(new Date().toISOString());
    var b = moment(testTime);
    if (a.diff(b, 'minutes') < 60)
      return true;
    else
      return false;
  }

  // Use for find the Time difference between two time stamp
  getTimeDiffernce(oldTime, newTime) {
    console.log("getTimeDiffernce")
    console.log("oldTime")
    console.log(oldTime)
    console.log("newTime")
    console.log(newTime)
    //    var currenttime = moment(new Date().toISOString()).locale('es').format();
    var a = moment(newTime);
    var b = moment(oldTime);
    return a.diff(b, 'minutes')
  }

  // Use for find the Time difference between two time stamp
  getDistance(lat1, long1, lat2, long2) {
    console.log("getDistance")
    console.log(lat1)
    console.log(long1)
    console.log(lat2)
    console.log(long2)
    return new Promise((resolve, reject) => {
      this.mapProvider.getDistanceMatrix(new google.maps.LatLng(lat1, long1), new google.maps.LatLng(lat2, long2)).subscribe(
        data => {
          console.log(data)
          let distance = data.rows[0].elements[0].distance.text;
          console.log(distance);
          resolve(distance.split(" ")[0]);
        },
        e => {
          reject(0);
          console.log('onError: %s', e);
        });
    });
  }

  // get time difference 

  getTime(lat1, long1, lat2, long2) {
    console.log("getDistance")
    console.log(lat1)
    console.log(long1)
    console.log(lat2)
    console.log(long2)
    return new Promise((resolve, reject) => {
      this.mapProvider.getDistanceMatrix(new google.maps.LatLng(lat1, long1), new google.maps.LatLng(lat2, long2)).subscribe(
        data => {
          console.log(data)
          let duration = data.rows[0].elements[0].duration.text;
          console.log(duration);
          resolve(duration.split(" ")[0]);
        },
        e => {
          reject(0);
          console.log('onError: %s', e);
        });
    });
  }

  sendPushNotification(recieverId, reciever, order_details, recieverUserType) {
    console.log("sendPushNotification");
    let params = {
      receiver_id: recieverId,
      msg_title: "New message recieved",
      msg_body: "Message from  " + reciever,
      optional_param: order_details.id + "," + recieverUserType,
      // optional_param:"1234567890",
      token: this.userProvider.token
    }

    console.log(params);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'send_push_notification_from_app ', params).map(res => res.json()).subscribe(res => {
        console.log('sendPushNotification res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('sendPushNotification err');
        console.log(err);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }


  sendPushNotificationForDelivery(recieverId, username, duration) {
    console.log("sendPushNotificationForDelivery");
    let params = {
      receiver_id: recieverId,
      msg_title: "Order is delievering by " + username,
      msg_body: "Your order is just  " + duration + "away",
      //optional_param: order_details.id + "," + recieverUserType,
      optional_param: "1234567890",
      token: this.userProvider.token
    }

    console.log(params);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'send_push_notification_from_app ', params).map(res => res.json()).subscribe(res => {
        console.log('sendPushNotificationForDelivery res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('sendPushNotificationForDelivery err');
        console.log(err);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }


  sendOrderStartNotification(recieverId, username) {
    let params = {
      receiver_id: recieverId,
      msg_title: "Order is delievering by " + username,
      msg_body: "Your order is started  ",
      //optional_param: order_details.id + "," + recieverUserType,
      optional_param: "1234567890",
      token: this.userProvider.token
    }

    console.log(params);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'send_push_notification_from_app ', params).map(res => res.json()).subscribe(res => {
        console.log('sendOrderStartNotification res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('sendOrderStartNotification err');
        console.log(err);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Use to post the meta id to delete the usermeta 
  stripePay(stripeInfo) {
    console.log("stripePay");
    console.log(stripeInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'processpay', stripeInfo).map(res => res.json()).subscribe(res => {
        console.log('stripePay res');
        console.log(res);
        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined && typeof res.err.msg === 'string')
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('stripePay err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }
}
