import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the AlertProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AlertProvider {

  constructor(
    private alertCtrl: AlertController
  ) {
    console.log('Hello AlertProvider Provider');
  }

// Used for alert messages
  okAlertMsg(msg) {
    this.alertCtrl.create({
      subTitle: msg,
      buttons: ['Ok']
    }).present();
  }

  okAlertTitleMsg(title, msg) {
    this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Ok']
    }).present();
  }
}
