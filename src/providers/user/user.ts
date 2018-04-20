import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Transfer, TransferObject } from '@ionic-native/transfer';
import { NativeStorage } from '@ionic-native/native-storage';

import { Api } from '../api/api';
import { AlertProvider } from '../../providers/alert/alert';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserProvider {
  deviceUuid: string;
  fcmId: string;
  user: any;
  token: any;
  userType: number;
  firebaseRegId:any;
  defaultAddress: any = [];
  badge:number=0;
  currentLocation: {
    lat: any,
    lng: any
  } = {
    lat: 0.0,
    lng: 0.0
  };
  orderFilter: {
    sort_type: number,
    category_id: number,
    order_loc: number,
    order_type: number,
    sort_column: string,
    radius: number
  }
  settings: any = {};
  secretCode: string;

  constructor(
    public http: Http,
    public api: Api,
    public nativeStorage: NativeStorage,
    public alert: AlertProvider,
    public transfer: Transfer
  ) {
    console.log('Hello UserProvider Provider');
  }

  // Used to set the type of user like customer or service provider
  setUserType(userType: string) {
    if (userType == 'customer')
      this.userType = 1;
    else if (userType == 'service')
      this.userType = 2;
    return new Promise((resolve, reject) => {
      resolve(this.nativeStorage.setItem('user_type', userType));
    });
  }

  // Used to get the type of user whether a customer or service provider
  getUserType() {
    return this.nativeStorage.getItem('user_type');
  }

  // Used to set the logintype user  
  setLoginType(loginType: number) {
    return new Promise((resolve, reject) => {
      resolve(this.nativeStorage.setItem('login_type', loginType));
    });
  }

  // Used to get the type login user either customer or service provider
  getLoginType() {
    return this.nativeStorage.getItem('login_type');
  }
  // Used to set a new user 
  setUser(user: any) {
    this.user = user;
    return new Promise((resolve, reject) => {
      resolve(this.nativeStorage.setItem('user', user));
    });
  }
  // Used to get the user 
  getUser() {
    return this.nativeStorage.getItem('user');
  }
  // Used to set the token id 
  setToken(token: any) {
    this.token = token;
    return new Promise((resolve, reject) => {
      resolve(this.nativeStorage.setItem('token', token));
    });
  }
  // used to get the token which is set in previous
  getToken() {
    return this.nativeStorage.getItem('token');
  }

  // Used to login in the app  
  login(userInfo: any) {
    console.log("login");
    userInfo.user_type = this.userType;
    userInfo.device_id = this.fcmId;
    userInfo.device_serial_no = this.deviceUuid;
    console.log(userInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.authUrl + 'signin', userInfo).map(res => res.json()).subscribe(res => {
        console.log('login res');
        console.log(res);
        if (res.status) {
          if (!res.msg) {
            this.setUser(res.data);
            this.setToken(res.token);
          }
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('login err');
        console.log(err);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to create an account for a new user
  signup(userInfo: any) {
    console.log("signup");
    console.log(userInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.authUrl + 'register', userInfo).map(res => res.json()).subscribe(res => {
        console.log('signup res');
        console.log(res);
        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('signup err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });

/*    return this.api.post(this.api.authUrl + 'register', userInfo).map(res => res.json())
*/  }
  // Used for emailverification which is madantory while creating a new account
  emailVerification(userInfo: any) {
    console.log("emailVerification");
    console.log(userInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.authUrl + 'email_verification', userInfo).map(res => res.json()).subscribe(res => {
        console.log('emailVerification res');
        console.log(res);
        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('emailVerification err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to recover a password(using forgot password) 
  forgotPassword(emailInfo: any) {
    console.log("forgotPassword");
    console.log(emailInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.authUrl + 'forgot_password', emailInfo).map(res => res.json()).subscribe(res => {
        console.log('forgotPassword res');
        console.log(res);
        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('forgotPassword err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //Used to reset our existing password
  resetPassword(resetInfo: any) {
    console.log("resetPassword");
    console.log(resetInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.authUrl + 'reset_password', resetInfo).map(res => res.json()).subscribe(res => {
        console.log('resetPassword res');
        console.log(res);
        if (res.status) {
          this.alert.okAlertMsg(res.msg);
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('resetPassword err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used for social sign in like facebook or google
  socialSignin(socialInfo: any) {
    console.log("socialSignin");
    socialInfo.user_type = this.userType;
    socialInfo.device_id = this.fcmId;
    socialInfo.device_serial_no = this.deviceUuid;
    console.log(socialInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.authUrl + 'social_signin', socialInfo).map(res => res.json()).subscribe(res => {
        console.log('socialSignin res');
        console.log(res);
        if (res.status) {
          this.setUser(res.data);
          this.setToken(res.token);
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('socialSignin err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to resend Email 
  resendEmail(resend: any) {
    console.log("resendEmail");
    console.log(resend);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.authUrl + 'resend_email', resend).map(res => res.json()).subscribe(res => {
        console.log('resendEmail res');
        console.log(res);
        if (res.status)
          resolve(res.msg);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('resendEmail err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }
  // Used to send the current lat long of user
  sendLatLong(latLongInfo: any) {
    console.log("sendLatLong");
    console.log(latLongInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'update_user_lat_long', latLongInfo).map(res => res.json()).subscribe(res => {
        console.log('sendLatLong res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('sendLatLong err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to save the updated settings of the user
  saveUserSettings(settings: any) {
    console.log("saveUserSettings");
    console.log(settings);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.authUrl + 'save_multiple_user_settings', settings).map(res => res.json()).subscribe(res => {
        console.log('saveUserSettings res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('saveUserSettings err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to set the user's settings
  setUserSettings(settings_name: string, settings_value: string) {
    var settings = {
      user_id: this.user.id,
      user_type: this.userType,
      token: this.token,
      settings_name: settings_name,
      settings_value: settings_value
    };

    console.log("setUserSettings");
    console.log(settings);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'save_user_settings', settings).map(res => res.json()).subscribe(res => {
        console.log('setUserSettings res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('setUserSettings err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //Used to get the user settings 
  getUserSettings() {
    console.log("getUserSettings");
    return new Promise((resolve, reject) => {
      this.api.get(this.api.apiUrl + `get_user_settings/${this.user.id}/${this.userType}?token=${this.token}`).map(res => res.json()).subscribe(res => {
        console.log('getUserSettings res');
        console.log(res);
        if (res.status) {
          var neglect = ["consumer_order_time", "service_delivery_raduis", "service_cap_amount", "service_cap_day", "service_min_atm", "service_max_atm", "service_min_atm", "service_max_atm", "service_order_gender", "consumer_preferred_orders"];
          if (res.data.length)
            res.data.map(d => {
              var check = true;
              neglect.map(n => {
                if (d.settings_name == n)
                  check = false;
              })
              if (d.settings_value == 0 && check)
                this.settings[d.settings_name] = false;
              else if (d.settings_value == 1 && check)
                this.settings[d.settings_name] = true;
              else
                this.settings[d.settings_name] = d.settings_value;
            });
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getUserSettings err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

//Used to get categories chosen by user, whether delivery or human ATM
  getCategories() {
    console.log("getCategories");
    return new Promise((resolve, reject) => {
      this.api.get(this.api.apiUrl + 'get_categories?token=' + this.token).map(res => res.json()).subscribe(res => {
        console.log('getCategories res');
        console.log(res);
        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getCategories err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //Used to change the type of user whether customer or service provider
  changeUserType() {
    console.log("changeUserType");
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'update_user_type', { user_id: this.user.id, token: this.token }).map(res => res.json()).subscribe(res => {
        console.log('changeUserType res');
        console.log(res);
        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('changeUserType err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to add the address of a user 
  addAddress(address: any) {
    console.log("addAddress");
    console.log(address);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'add_address', address).map(res => res.json()).subscribe(res => {
        console.log('addAddress res');
        console.log(res);
        if (res.status)
          resolve(res.msg);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('addAddress err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //Used to set an address as default address
  setDefaultAddress(address: any) {
    console.log("setDefaultAddress");
    console.log(address);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'set_default_address', address).map(res => res.json()).subscribe(res => {
        console.log('setDefaultAddress res');
        console.log(res);
        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('setDefaultAddress err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // delete address 
  deleteAddress(_id){
     console.log("delete address");
    return new Promise((resolve, reject) => {
      this.api.get(this.api.apiUrl + `delete_address/${this.user.id}/${_id}?token=${this.token}`).map(res => res.json()).subscribe(res => {
        console.log('getAddressList res');
        console.log(res);
        if (res.status) {
         resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
      }, err => {
        console.log('getAddressList err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //Used to get the address list of users 
  getAddressList() {
    console.log("getAddressList");
    return new Promise((resolve, reject) => {
      this.api.get(this.api.apiUrl + `get_address_list/${this.user.id}?token=${this.token}`).map(res => res.json()).subscribe(res => {
        console.log('getAddressList res');
        console.log(res);
        if (res.status) {
          this.defaultAddress = res.data.filter(address => { return address.set_default == 1 })
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getAddressList err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //Used to update user profile
  updateProfile(userInfo: any) {
    console.log("updateProfile");
    console.log(userInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'update_profile', userInfo).map(res => res.json()).subscribe(res => {
        console.log('updateProfile res');
        console.log(res);
        if (res.status) {
          this.setUser(res.data);
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('updateProfile err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //Used to change the profile image or update it
  updateProfileImage(profilePic: any) {
    console.log("updateProfileImage");

    return new Promise((resolve, reject) => {
      const fileTransfer: TransferObject = this.transfer.create();

      var filename = profilePic.split("/").pop();
      var changeScope = this;
      var options = {
        fileKey: "profile_image",              // this equal to <input type="file" id="upl">
        fileName: filename,
        mimeType: "image/jpg",
        chunkedMode: false,
        params: { 'user_id': this.user.id },
        headers: { 'x-access-token': this.token }
      }
      console.log('params' + JSON.stringify(options));

      fileTransfer.upload(profilePic, this.api.apiUrl + 'update_profile_image', options)
        .then(result => {
          console.log("fileTransfer upload SUCCESS:");
          console.log(result);
          var res = JSON.parse(result.response)
          if (res.status) {
            this.setUser(res.data);
            resolve(result.response);
          }
          else
            reject(res.msg);
        }, err => {
          console.log('errrrrrr' + JSON.stringify(err));
          reject(err);
        });
    });
  }

  // Used to post the details to get user
  getUserMeta(meta_key) {
    console.log("getUserMeta");
    var userMeta = {
      user_id: this.user.id,
      user_type: this.userType,
      meta_key: meta_key,
      token: this.token
    }

    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'get_user_meta', userMeta).map(res => res.json()).subscribe(res => {
        console.log('getUserMeta res');
        console.log(res);
        if (res.status) {
          if (res.data.length != 0) {
            this.secretCode = res.data[0].meta_value;
          } else {
            this.secretCode = ''
          }

          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getUserMeta err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //Used to post the details to add user
  addUserMeta(meta_key, meta_value) {
    console.log("addUserMeta");
    console.log(userMeta);
    var userMeta = {
      user_id: this.user.id,
      user_type: this.userType,
      meta_key: meta_key,
      meta_value: meta_value,
      token: this.token
    }
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'add_user_meta', userMeta).map(res => res.json()).subscribe(res => {
        console.log('addUserMeta res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('addUserMeta err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }



  addFirebaseId(meta_key, meta_value,userType) {
    var userMeta = {
      user_id: this.user.id,
      user_type: userType,
      meta_key: meta_key,
      meta_value: meta_value,
      token: this.token
    }

    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'add_user_meta', userMeta).map(res => res.json()).subscribe(res => {
        console.log('addFirebaseId res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('addFirebaseId err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //Used to post the details for get firebase id
  getFirebaseId(meta_key, id, user_type) {
    console.log("getUserMeta");
    var userMeta = {
      user_id: id,
      user_type: user_type,
      meta_key: meta_key,
      token: this.token
    }

    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'get_user_meta', userMeta).map(res => res.json()).subscribe(res => {
        console.log('get firebase id res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getUserMeta err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to post the details to update user meta
  updateUserMeta(meta_key, meta_value, _id) {
    console.log("updateUserMeta");
    var userMeta = {
      usermeta_id: _id,
      meta_key: meta_key,
      meta_value: meta_value,
      token: this.token
    }
    console.log(userMeta);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'update_user_meta', userMeta).map(res => res.json()).subscribe(res => {
        console.log('updateUserMeta res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('updateUserMeta err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Use to post the meta id to delete the usermeta 
  deleteUserMeta(meta_id) {
    console.log("deleteUserMeta");
    console.log(userMeta);
    var userMeta = {
      usermeta_id: meta_id,
      token: this.token
    }
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'delete_user_meta', userMeta).map(res => res.json()).subscribe(res => {
        console.log('deleteUserMeta res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('deleteUserMeta err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //Use to logout from the app
  logout() {
    console.log("logout");
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'signout', { 'user_id': this.user.id, 'token': this.token }).map(res => res.json()).subscribe(res => {
        console.log('logout res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('logout err');
        console.log(err);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  getUserById(_id) {
     console.log("getUserById");
     console.log(_id);
    return new Promise((resolve, reject) => {
      this.api.get(this.api.apiUrl + `get_user_data_by_id/${_id}?token=${this.token}`).map(res => res.json()).subscribe(res => {
        console.log('res');

        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getUserById err');
        console.log(err);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }
  //Used to get notifications 
  getNotifications() {
    
    return new Promise((resolve, reject) => {
      console.log(this.user.id);
      console.log(this.userType);
      console.log(this.token);
      this.api.get(this.api.apiUrl + `get_notifications/${this.user.id}/${this.userType}?token=${this.token}`).map(res => res.json()).subscribe(res => {
        console.log('getNotifications res');
        console.log(res);
        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getNotifications err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }
}


