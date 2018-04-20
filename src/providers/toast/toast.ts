import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the Toast provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Toast {

  constructor(public toastCtrl: ToastController) {
    console.log('Hello Toast Provider');
  }
  show(msg){
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    }).present();
  }

}
