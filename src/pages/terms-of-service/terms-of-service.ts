import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the TermsOfServicePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-terms-of-service',
  templateUrl: 'terms-of-service.html',
})
export class TermsOfServicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsOfServicePage');
  }

// Used for dismiss modal
  dismiss() {
    this.view.dismiss();
  }

}
