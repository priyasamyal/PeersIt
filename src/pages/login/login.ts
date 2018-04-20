import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { CustomerHomePage } from '../customer-home/customer-home';
import { CustomerProfilePage } from '../customer-profile/customer-profile';
import { EmailVerificationPage } from '../email-verification/email-verification';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { ServiceHomePage } from '../service-home/service-home';
import { ServiceProfilePage } from '../service-profile/service-profile';
import { SignupPage } from '../signup/signup';

import { FacebookProvider } from '../../providers/facebook/facebook';
import { GoogleProvider } from '../../providers/google/google';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
import { AlertProvider } from '../../providers/alert/alert';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public fbProvider: FacebookProvider,
    public googleProvider: GoogleProvider,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider,
    public alert: AlertProvider,
    public auth: AuthProvider,
  ) {
    this.loginForm = new FormGroup({
      email_id: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  createFirebaseAccount(email, password) {
    console.log(email);
    console.log(password);
    let credentials = {
      email: email,
      password: password
    }
    this.auth.createAccount(credentials)
      .then((data) => {
        console.log("fire base id", data);
        this.getFirebaseId(data.uid);
      }, (error) => {
        console.log(error);
        this.signinFirebase(email, password);
      });
  };

  signinFirebase(email, password) {
    console.log(email);
    console.log(password);
    let credentials = {
      email: email,
      password: password
    }
    this.auth.signin(credentials)
      .then((data) => {
        console.log("fire base id", data);
        this.userProvider.firebaseRegId = data.uid;
        this.getFirebaseId(data.uid);
      }, (error) => {
        console.log(error)
      });
  };



  getFirebaseId(_id) {
    this.userProvider.getFirebaseId('firebaseid', this.userProvider.user.id, this.userProvider.userType).then(data => {
      console.log("this.userProvider.addUserMeta success");
      console.log("firebase ids.....................................................", data);

      var d = JSON.parse(JSON.stringify(data));
      if (d.length != 0) {

      } else {
        this.saveFirebaseId(_id);
      }
    }, err => {
      console.log("addUserMeta err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  saveFirebaseId(_id) {
    this.userProvider.addFirebaseId('firebaseid', _id, this.userProvider.userType).then(data => {
      console.log("this.userProvider.addUserMeta success");
      console.log(data);
    }, err => {
      console.log("addUserMeta err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  // Used to login to the app
  doLogin() {
    console.log("doLogin");
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' });
    loading.present();
    this.userProvider.login(this.loginForm.value).then(data => {
      console.log("this.userProvider.login success");
      loading.dismiss();
      console.log(data);

      this.signinFirebase(this.loginForm.value.email_id, this.loginForm.value.email_id);

      if (this.userProvider.token) {
        this.userProvider.setLoginType(1);
        if (this.loginForm.value.user_type == 1)
          this.navCtrl.setRoot(CustomerHomePage);
        else if (this.loginForm.value.user_type == 2)
          this.navCtrl.setRoot(ServiceHomePage);
      }
      else
        this.modal.create(EmailVerificationPage, { 'user_data': data }).present();
    }, err => {
      console.log("signup err")
      loading.dismiss();
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  // Used for facebook login
  doFacebookLogin() {
    console.log('doFacebookLogin');
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader
    loading.present(); //loading present

    // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app
    let env = this;

    env.fbProvider.getFacebookUser()
      .then(data => {
        console.log('doFacebookLogin success')
        var resJson = JSON.parse(JSON.stringify(data));
        var socialInfo = {
          auth_id: resJson.userId,
          auth_type: 2,
          first_name: resJson.firstName,
          last_name: resJson.lastName,
          profile_image: resJson.image,
          email_id: resJson.userId + "@facebook.com"
        };
        if (resJson.gender == "male")
          socialInfo["gender"] = 1;
        else if (resJson.gender == "female")
          socialInfo["gender"] = 2;
        // user is previously logged with FB and we have his data we will let him access the app
        env.userProvider.socialSignin(socialInfo).then(data => {
          loading.dismiss(); //loading dismiss
          env.socialLoginSuccess(resJson.userId, "facebook");
        }, err => {
          console.log("social login err")
          console.log(err)
          loading.dismiss(); //loading dismiss
          env.alert.okAlertTitleMsg("Error", err);
        });

      }, error => {
        console.log('doFacebookLogin error')
        //we don't have the user data so we will ask him to log in
        env.fbProvider.doFacebookLogin()
          .then(function (res) {
            console.log("res");
            var resJson = JSON.parse(JSON.stringify(res));
            var socialInfo = {
              auth_id: resJson.userId,
              auth_type: 2,
              first_name: resJson.firstName,
              last_name: resJson.lastName,
              profile_image: resJson.image,
              email_id: resJson.userId + "@facebook.com"
            };
            if (resJson.gender == "male")
              socialInfo["gender"] = 1;
            else if (resJson.gender == "female")
              socialInfo["gender"] = 2;
            env.userProvider.socialSignin(socialInfo).then(data => {
              loading.dismiss(); //loading dismiss
              env.socialLoginSuccess(resJson.userId, "facebook");
            }, err => {
              console.log("social login err")
              console.log(err)
              loading.dismiss(); //loading dismiss
              env.alert.okAlertTitleMsg("Error", err);
            });

          }, function (err) {
            console.log("Facebook Login error", err);
            loading.dismiss(); //loading dismiss
          });
      });
  }

  // Used for google login 
  doGoogleLogin() {
    console.log('doGoogleLogin')
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader
    loading.present(); //loading present

    // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app
    let env = this;

    env.googleProvider.trySilentLogin()
      .then(data => {
        console.log('doGoogleLogin success')
        // user is previously logged with Google and we have his data we will let him access the app
        var resJson = JSON.parse(JSON.stringify(data));
        var socialInfo = {
          auth_id: resJson.userId,
          auth_type: 3,
          first_name: resJson.firstName,
          last_name: resJson.lastName,
          profile_image: resJson.image,
          email_id: resJson.userId + "@gmail.com"
        };
        env.userProvider.socialSignin(socialInfo).then(data => {
          loading.dismiss(); //loading dismiss
          env.socialLoginSuccess(resJson.userId, "gmail");
        }, err => {
          console.log("social login err")
          console.log(err)
          loading.dismiss(); //loading dismiss
          env.alert.okAlertTitleMsg("Error", err);
        });

      }, error => {
        console.log('doGoogleLogin error')
        //we don't have the user data so we will ask him to log in
        env.googleProvider.doGoogleLogin()
          .then(function (res) {
            var resJson = JSON.parse(JSON.stringify(res));
            var socialInfo = {
              auth_id: resJson.userId,
              auth_type: 3,
              first_name: resJson.firstName,
              last_name: resJson.lastName,
              profile_image: resJson.image,
              email_id: resJson.userId + "@gmail.com"
            };
            env.userProvider.socialSignin(socialInfo).then(data => {
              loading.dismiss(); //loading dismiss
              env.socialLoginSuccess(resJson.userId, "gmail");
            }, err => {
              console.log("social login err")
              console.log(err)
              loading.dismiss(); //loading dismiss
              env.alert.okAlertTitleMsg("Error", err);
            });

          }, function (err) {
            console.log("Google Login error", err);
            loading.dismiss(); //loading dismiss
          });
      });
  }


  // Used to navigate to signup page 
  goToSignup() {
    this.navCtrl.push(SignupPage);
  }

  // Used to navigate to forgot password page
  goToForgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);
  }

  socialLoginSuccess(socialId, type) {
    if (type == "facebook")
      this.userProvider.setLoginType(2);
    else if (type == "gmail")
      this.userProvider.setLoginType(3);
    this.createFirebaseAccount(`${socialId}@${type}.com`, socialId);
    if (this.userProvider.user.dob == null && this.userProvider.userType == 1)
      this.navCtrl.setRoot(CustomerProfilePage);
    else if (this.userProvider.user.dob == null && this.userProvider.userType == 2)
      this.navCtrl.setRoot(ServiceProfilePage);
    else if (this.userProvider.user.dob != null && this.userProvider.userType == 1)
      this.navCtrl.setRoot(CustomerHomePage);
    else if (this.userProvider.user.dob != null && this.userProvider.userType == 2)
      this.navCtrl.setRoot(ServiceHomePage);
  }

}
