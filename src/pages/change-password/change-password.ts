import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { LoginPage } from '../login/login';

import { UserProvider } from '../../providers/user/user';
import { AlertProvider } from '../../providers/alert/alert';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  changePasswordForm: FormGroup;
  disabled = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public view: ViewController,
    public userProvider: UserProvider,
    public alert: AlertProvider,
    public loadingCtrl: LoadingController
  ) {
    this.changePasswordForm = new FormGroup({
      vf_code: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required)
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  dismiss() {
    this.view.dismiss();
  }

// This function is for Change Password 
  doChangePassword(){
    console.log('doChangePassword()');
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); //loader create
    loading.present(); // loading present
    this.changePasswordForm.value.email_id = this.navParams.get('user_data').email_id;
    this.userProvider.resetPassword(this.changePasswordForm.value).then( data => {
      console.log("this.userProvider.emailVerification success");
      loading.dismiss(); //loading dismiss
      console.log(data);
      this.view.dismiss(true);
    }, err => {
      console.log("resetPassword err")
      loading.dismiss(); //loading dismiss
      console.log(err)
      this.alert.okAlertTitleMsg("Error",err);
    })
  }

// Used to resend Email to user
  resendMail() {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); //loader create
    loading.present(); // loading present
    this.disabled = true;
    console.log("resendEmail");
    console.log(this.navParams.get('user_data'));
    var resend = {
      first_name: this.navParams.get('user_data').first_name,
      last_name: this.navParams.get('user_data').last_name,
      email_id: this.navParams.get('user_data').email_id,
      id: this.navParams.get('user_data').id,
      email_type: 2
    }
    this.userProvider.resendEmail(resend).then(data => {
      console.log("this.userProvider.resendEmail success");
      loading.dismiss(); //loading dismiss
      console.log(data);
      this.alert.okAlertMsg(data);
      this.disabled = false;
    }, err => {
      console.log("resendEmail err")
      console.log(err)
      loading.dismiss(); //loading dismiss
      this.disabled = false;
    })
  }

}
