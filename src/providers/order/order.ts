import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Transfer, TransferObject } from '@ionic-native/transfer';

import { Api } from '../api/api';
import { UserProvider } from '../user/user';

/*
  Generated class for the OrderProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class OrderProvider {

  constructor(
    public http: Http,
    public api: Api,
    public transfer: Transfer,
    public userProvider: UserProvider
  ) {
    console.log('Hello OrderProvider Provider');
  }
  // Used to create a new order
  addOrder(orderInfo: any) {
    console.log("addOrder");
    console.log(orderInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'create_order', orderInfo).map(res => res.json()).subscribe(res => {
        console.log('res');
        console.log(res);

        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('addOrder err');
        console.log(err);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }
  // Used to add secret code in new order creation
  addOrderSecretCodes(orderInfo: any) {
    console.log("addOrderSecretCodes");
    console.log(orderInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'add_order_secret_codes', orderInfo).map(res => res.json()).subscribe(res => {
        console.log('addOrderSecretCodes res');
        console.log(res);
        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('addOrderSecretCodes err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to upload images while creating orders
  uploadOrderImage(order_id, item_id, token, image) {
    console.log("uploadOrderImage");
    console.log("image");
    console.log(image);
    return new Promise((resolve, reject) => {

      var title = image.substr(image.lastIndexOf('/') + 1);
      console.log(image);
      console.log(title);
      var options = {
        fileKey: "image",
        fileName: title,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'order_id': order_id, 'order_detail_id': item_id, 'title': title, 'token': token }
      };

      const fileTransfer: TransferObject = this.transfer.create();

      // Use the FileTransfer to upload the image
      fileTransfer.upload(image, this.api.apiUrl + 'create_order_images', options).then(data => {
        console.log("fileTransfer.upload success");
        console.log(data);
        resolve(data.response)
      }, err => {
        console.log("fileTransfer.upload err");
        console.log(err);
        reject(err);
      });
    });
  }

  // Used to get the customer placing order list
  getCustomerOrderList(listType, sort_type, sort_column) {
    console.log("getCustomerOrderList");
    var orderInfo = {
      user_id: this.userProvider.user.id,
      list_type: listType, //(1-history orders list,2-future orders list,3-ongoing orders list)
      sort_column: sort_column,//(item_number / total_cost / window_start(default))
      sort_type: sort_type,//1 (0-ascending, 1-descending)
      token: this.userProvider.token
    }
    console.log(orderInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'get_orders_list', orderInfo).map(res => res.json()).subscribe(res => {
        console.log('res');
        console.log(res);
        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getCustomerOrderList err');
        console.log(err);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to get the history of accepted orders on consumer side
  getServiceOrderHistoryAccepted(list_type, sort_type, set_column) {
    console.log("getServiceOrderHistoryAccepted");
    var orderInfo = {
      user_id: this.userProvider.user.id,
      list_type: list_type,// (1-suppliers history orders list,2-suppliers ongoing orders list)
      sort_column: set_column,// (total_cost / window_start(default))
      sort_type: sort_type,//1 (0-ascending, 1-descending)
      token: this.userProvider.token
    }
    console.log(orderInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'get_supplier_orders_list', orderInfo).map(res => res.json()).subscribe(res => {
        console.log('getServiceOrderHistoryAccepted res');
        console.log(res);
        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getServiceOrderHistoryAccepted err');
        console.log(err);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to accept the order by service provider
  acceptServiceOrder(orderInfo: any) {
    console.log("acceptServiceOrder");
    console.log(orderInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'accept_reject_order', orderInfo).map(res => res.json()).subscribe(res => {
        console.log('acceptServiceOrder res');
        console.log(res);
        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('acceptServiceOrder err');
        console.log(err);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to get the list of orders
  getAllServiceOrders(orderInfo: any) {
    console.log("getAllServiceOrders");
    console.log(orderInfo);
    orderInfo.token = this.userProvider.token;
    orderInfo.supplier_id = this.userProvider.user.id;
    if (orderInfo.category_id == 3)
      delete orderInfo.category_id;
    if (orderInfo.order_type == 2)
      delete orderInfo.order_type;
    if (orderInfo.order_loc == 0) {
      orderInfo.lat = this.userProvider.currentLocation.lat;
      orderInfo.lng = this.userProvider.currentLocation.lng;
    }
    else {
      orderInfo.lat = this.userProvider.defaultAddress[0].lat;
      orderInfo.lng = this.userProvider.defaultAddress[0].lng;
    }
    delete orderInfo.order_loc;
    console.log(orderInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'get_all_available_orders', orderInfo).map(res => res.json()).subscribe(res => {
        console.log('getAllServiceOrders res');
        console.log(res);
        if (res.status)
          resolve(res.data);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getServiceOrderMapList err');
        console.log(err);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to cancel order on consumer side
  cancelConsumerOrder(orderInfo) {
    console.log("cancelConsumerOrder");
    console.log(orderInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'cancel_order', orderInfo).map(res => res.json()).subscribe(res => {
        console.log('cancelConsumerOrder res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('cancelConsumerOrder err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to delete order on consumer side
  deleteOrder(orderId) {
    console.log("deleteOrder");
    console.log(orderId)
    return new Promise((resolve, reject) => {
      this.api.get(this.api.apiUrl + `delete_order/${this.userProvider.user.id}/${orderId}?token=${this.userProvider.token}`).map(res => res.json()).subscribe(res => {
        console.log('deleteOrder res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('deleteOrder err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to permanent delete order on consumer side
  permanentDeleteOrder(orderId) {
    console.log("permanentDeleteOrder");
    console.log(orderId)
    return new Promise((resolve, reject) => {
      this.api.get(this.api.apiUrl + `permanent_delete_order/${this.userProvider.user.id}/${orderId}?token=${this.userProvider.token}`).map(res => res.json()).subscribe(res => {
        console.log('permanentDeleteOrder res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('permanentDeleteOrder err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to delete order on consumer side
  deleteOrderItem(orderInfo) {
    console.log("deleteOrderItem");
    console.log(orderInfo)
    return new Promise((resolve, reject) => {
      this.api.get(this.api.apiUrl + 'delete_order_item', orderInfo).map(res => res.json()).subscribe(res => {
        console.log('deleteOrderItem res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('deleteOrderItem err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to edit an order 
  editOrder(orderInfo: any) {
    console.log("editOrder");
    console.log(orderInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'edit_order', orderInfo).map(res => res.json()).subscribe(res => {
        console.log('editOrder res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('editOrder err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to edit an order 
  updateDraftOrderImages(orderInfo: any) {
    console.log("updateDraftOrderImages");
    console.log(orderInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'update_draft_order_images', orderInfo).map(res => res.json()).subscribe(res => {
        console.log('updateDraftOrderImages res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('updateDraftOrderImages err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to complete the order 
  orderComplete(orderInfo: any) {
    console.log("orderComplete");
    console.log(orderInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'order_completed', orderInfo).map(res => res.json()).subscribe(res => {
        console.log('orderComplete res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('orderComplete err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //  Used to get the details of an order
  getOrderDetails(orderId: number) {
    console.log("getOrderDetails");
    console.log(orderId);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'order_details_by_id', { 'token': this.userProvider.token, 'order_id': orderId }).map(res => res.json()).subscribe(res => {
        console.log('getOrderDetails res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getOrderDetails err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //  Used to get near by human atms
  getNearbyHumanAtms(atmsInfo: any) {
    console.log("getNearbyHumanAtms");
    console.log(atmsInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'get_nearby_human_atms', atmsInfo).map(res => res.json()).subscribe(res => {
        console.log('getNearbyHumanAtms res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getNearbyHumanAtms err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //  Used to get order amount
  getOrderAmount(orderAmount: any) {
    console.log("getOrderAmount");
    console.log(orderAmount);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'order_amount_calculation', orderAmount).map(res => res.json()).subscribe(res => {
        console.log('getOrderAmount res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getOrderAmount err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to post the details to get order meta
  getOrderMeta(orderMeta: any) {
    console.log("getUserMeta");
    /*     var orderMeta = {
          order_id: this.user.id,
          meta_name: meta_key,
          token: this.token
        }
     */
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'get_order_meta', orderMeta).map(res => res.json()).subscribe(res => {
        console.log('getOrderMeta res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getOrderMeta err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  //Used to post the details to add order meta
  addOrderMeta(orderMeta: any) {
    console.log("addOrderMeta");
    console.log(orderMeta);
    /*     var orderMeta = {
          order_id: this.user.id,
          user_type: this.userType,
          meta_key: meta_key,
          meta_value: meta_value,
          token: this.token
        } */
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'add_order_meta', orderMeta).map(res => res.json()).subscribe(res => {
        console.log('addOrderMeta res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('addOrderMeta err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }


  // Used to post the details to update order meta
  updateOrderMeta(orderMeta: any) {
    console.log("updateOrderMeta");
    /*     var orderMeta = {
          ordermeta_id: _id,
          meta_key: meta_key,
          meta_value: meta_value,
          token: this.token
        } */
    console.log(orderMeta);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'update_order_meta', orderMeta).map(res => res.json()).subscribe(res => {
        console.log('updateOrderMeta res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('updateOrderMeta err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Use to delete the order Image 
  deleteOrderImages(orderImage: any) {
    console.log("deleteOrderImages");
    console.log(orderImage);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'delete_order_images', orderImage).map(res => res.json()).subscribe(res => {
        console.log('deleteOrderImages res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('deleteOrderImages err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Use to post the meta id to delete the order meta 
  deleteOrderMeta(orderMeta: any) {
    console.log("deleteOrderMeta");
    console.log(orderMeta);
/*     var orderMeta = {
      ordermeta_id: meta_id,
      token: this.token
    }
 */    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'delete_order_meta', orderMeta).map(res => res.json()).subscribe(res => {
        console.log('deleteOrderMeta res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('deleteOrderMeta err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to post the details to update order meta
  getOrderInvoice(orderID) {
    var orderMeta = {
      order_id: orderID,
      token: this.userProvider.token
    }
    console.log(orderMeta);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'get_order_calculations', orderMeta).map(res => res.json()).subscribe(res => {
        console.log('getOrderInvoice res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getOrderInvoice err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to post the details to update order meta
  getCheckOrderCreateSettings(orderSettings) {
    console.log("getCheckOrderCreateSettings");
    console.log(orderSettings);
/*      return new Promise((resolve, reject) => {
      resolve({"status":1,"msg":"Allowed","data":[{"settings_name":"resting_allowed_days","settings_value":"5"},{"settings_name":"resting_min_suppliers","settings_value":"2"},{"settings_name":"resting_min_miles","settings_value":"5"},{"settings_name":"postal_code_status","settings_value":"0"},{"settings_name":"resting_deliv_status","settings_value":"1"},{"settings_name":"resting_atm_status","settings_value":"1"},{"settings_name":"max_allowed_days_option","settings_value":"Days"},{"settings_name":"on_demand_deliv_status","settings_value":"0"},{"settings_name":"on_demand_atm_status","settings_value":"1"},{"settings_name":"on_demand_min_suppliers","settings_value":"22"},{"settings_name":"on_demand_min_miles","settings_value":"5"},{"settings_name":"pick_drop_max_distance","settings_value":"3000"}],"on_demand_sup":25,"resting_sup":0});
    })
 */       return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'check_order_create_settings', orderSettings).map(res => res.json()).subscribe(res => {
        console.log('getCheckOrderCreateSettings res');
        console.log(res);
        if (res.status)
          resolve(res);
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('getCheckOrderCreateSettings err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

  // Used to post the details to update order meta
  verifyCoupon(couponCode) {
    var couponInfo = {
      coupon_code: couponCode,
      token: this.userProvider.token
    }
    console.log(couponInfo);
    return new Promise((resolve, reject) => {
      this.api.post(this.api.apiUrl + 'verify_coupon', couponInfo).map(res => res.json()).subscribe(res => {
        console.log('verifyCoupon res');
        console.log(res);
        if (res.status) {
          resolve(res.data);
        }
        else if (res.msg.errno == undefined)
          reject(res.msg);
        else
          reject("Please enter vaild inputs");
      }, err => {
        console.log('verifyCoupon err');
        console.log(err.msg);
        if (err.msg)
          reject(err.msg);
        else
          reject("Server not responding")
      });
    });
  }

}
