import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { CustomerHomePage } from '../customer-home/customer-home';
import { ServiceHomePage } from '../service-home/service-home';
import { LoginPage } from '../login/login';

import { AlertProvider } from '../../providers/alert/alert';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the EmailVerificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-email-verification',
  templateUrl: 'email-verification.html',
})
export class EmailVerificationPage {
  emailForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public view: ViewController,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider,
    private loadingCtrl: LoadingController,
    public alert: AlertProvider
  ) {
    this.emailForm = new FormGroup({
      vf_code: new FormControl('', Validators.required)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailVerificationPage');
  }

  dismiss() {
    this.view.dismiss();
  }

// Used for sending email to customer for verificaton 
  doVerify() {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader create
    loading.present(); //loading present
    console.log('doVerify()');
    this.emailForm.value.user_id = this.navParams.get('user_data').id;

    this.userProvider.emailVerification(this.emailForm.value).then(data => {
      console.log("this.userProvider.emailVerification success");
      loading.dismiss(); // loading dismiss
      console.log(data);
      this.alert.okAlertMsg("Your email is verified, now you can login");

      this.view.dismiss(true);
    }, err => {
      console.log("emailVerification err");
      loading.dismiss();
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }
  
// Use for resend the mail while customer can't get email at first time
  resendMail() {
    var resend = {
      first_name: this.navParams.get('user_data').first_name,
      last_name: this.navParams.get('user_data').last_name,
      email_id: this.navParams.get('user_data').email_id,
      id: this.navParams.get('user_data').id,
      email_type: 1
    }
    this.userProvider.resendEmail(resend).then(data => {
      console.log("this.userProvider.saveUserSettings success");
      console.log(data);
      this.alert.okAlertMsg(data);
    }, err => {
      console.log("saveUserSettings err")
      console.log(err)
    })
  }
}
