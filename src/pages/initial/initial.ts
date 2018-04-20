import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { InitialModel } from './initial.model';

import { LoginPage } from '../login/login';

import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the InitialPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-initial',
  templateUrl: 'initial.html',
})
export class InitialPage {
  initial: InitialModel = new InitialModel();
  loading: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public userProvider: UserProvider
  ) {
//    this.loading = this.loadingCtrl.create();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InitialPage');
  }

// Used for checking the user type 
  signIn(userType: string){
    console.log("userType");
    console.log(userType);
    this.userProvider.setUserType(userType);
    this.navCtrl.push(LoginPage);
  }
}
