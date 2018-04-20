import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { ChangePasswordPage } from '../change-password/change-password';
import { LoginPage } from '../login/login';

import { UserProvider } from '../../providers/user/user';
import { AlertProvider } from '../../providers/alert/alert';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  forgotPasswordForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modal: ModalController,
    public userProvider: UserProvider,
    public loadingCtrl: LoadingController,
    public alert: AlertProvider
  ) {
    this.forgotPasswordForm = new FormGroup({
      email_id: new FormControl('', Validators.required)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

// Used for password recovery(forgot password)
  recoverPassword() {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); //loader create
    loading.present();// loading present
    console.log("recoverPassword");
    console.log(this.forgotPasswordForm.value);
    this.forgotPasswordForm.value.user_type = this.userProvider.userType;
    this.userProvider.forgotPassword(this.forgotPasswordForm.value).then(data => {
      console.log("this.userProvider.forgotPassword success");
      loading.dismiss(); //loading dismiss
      let modal = this.modal.create(ChangePasswordPage, { 'user_data': data });
      modal.onDidDismiss(data => {
        if (data)
          this.navCtrl.pop();
      });
      modal.present();
    }, err => {
      console.log("recoverPassword err")
      loading.dismiss(); // loading dismiss
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    });
  }

}
