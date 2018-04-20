import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, Loading } from 'ionic-angular';
import moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { Events } from 'ionic-angular';

import { OrderProvider } from '../../providers/order/order';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';

import { AlertProvider } from '../../providers/alert/alert';

/**
 * Generated class for the CustomerNotificationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-notifications',
  templateUrl: 'service-notifications.html',
})
export class ServiceNotificationsPage {
  notifications: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public orderProvider: OrderProvider,
     public events: Events,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public userProvider: UserProvider,
    public alert: AlertProvider,
    public utilsProvider: UtilsProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerNotificationsPage');
  }

  ionViewWillEnter() {
    this.getNotifications();
     this.events.publish('badge:created', 0);
  }

getNotifications() {
    this.userProvider.getNotifications().then(data => {
    
      for(let i in data){
        this.notifications.push({message:data[i].notification, time: moment.utc(data[i].date).format("hh:mm A"),})
      }
       
    }, (err) => {

    })
  }

}
