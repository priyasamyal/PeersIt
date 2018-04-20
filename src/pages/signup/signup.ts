import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { CustomerHomePage } from '../customer-home/customer-home';
import { CustomerProfilePage } from '../customer-profile/customer-profile';
import { EmailVerificationPage } from '../email-verification/email-verification';
import { ServiceHomePage } from '../service-home/service-home';
import { ServiceProfilePage } from '../service-profile/service-profile';
import { LoginPage } from '../login/login';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { TermsOfServicePage } from '../terms-of-service/terms-of-service';

import { FacebookProvider } from '../../providers/facebook/facebook';
import { GoogleProvider } from '../../providers/google/google';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
import { AlertProvider } from '../../providers/alert/alert';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';


/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  signupForm: FormGroup;

  maxStart: any = new Date().toISOString();


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
    public auth: AuthProvider
  ) {
    this.signupForm = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      organization: new FormControl(''),
      dob: new FormControl(new Date(new Date().setFullYear(new Date().getFullYear() - 20)).toISOString(), Validators.required),
      gender: new FormControl('', Validators.required),
      email_id: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),
      accept: new FormControl(true, Validators.requiredTrue)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

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
        this.getFirebaseId(data.uid);
      }, (error) => {
        console.log(error)
      });
  };

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
      //  this.alert.okAlertTitleMsg("Error", err);
    })
  };

  saveFirebaseId(_id) {
    this.userProvider.addFirebaseId('firebaseid', _id, this.userProvider.userType).then(data => {
      console.log("this.userProvider.addUserMeta success");
      console.log(data);
    }, err => {
      console.log("addUserMeta err")
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  };


  // Used to create a new account
  doSignup() {
    console.log("doSignup")
    let loading = this.loadingCtrl.create({ content: 'Please wait...' }); //loader
    loading.present();//loading present
    console.log(this.signupForm.value);
    this.signupForm.value.dob = this.signupForm.value.dob.split('T')[0];
    this.signupForm.value.user_type = this.userProvider.userType;

    this.userProvider.signup(this.signupForm.value).then(data => {
      console.log("this.userProvider.signup success");
      loading.dismiss();// loading dismiss
      console.log(data);
      this.signupForm.value.id = data;
      this.userProvider.user = this.signupForm.value;

      let modal = this.modal.create(EmailVerificationPage, { 'user_data': { 'id': data, 'first_name': this.signupForm.value.first_name, 'last_name': this.signupForm.value.last_name, 'email_id': this.signupForm.value.email_id } });
      modal.onDidDismiss(data => {

        if (data) {
          this.createFirebaseAccount(this.signupForm.value.email_id, this.signupForm.value.email_id);
          this.navCtrl.push(LoginPage);
        }

      });
      modal.present();


      //      this.navCtrl.push(EmailVerificationPage, {'user_id': data});
    }, err => {
      console.log("signup err")
      loading.dismiss();// loading dismiss
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
    /*    this.userProvider.signup(this.signupForm.value).subscribe(res => {
          console.log("this.userProvider.signup success");
          console.log(res);
          if(res.status){
            this.signupForm.value.id = res.data;
            this.navCtrl.push(EmailVerificationPage);
          }
          else{
            console.log("else")
            this.toast.show(res.msg);
          }
        }, err => {
          console.log("err signup")
          console.log(err)
        })*/

  }

  // Used for signup with facebook
  doFacebookSignup() {
    console.log('doFacebookSignup');
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader
    loading.present(); //loading present

    // Here we will check if the user is already logged in
    // because we don't want to ask users to log in each time they open the app
    let env = this;

    env.fbProvider.getFacebookUser().then(data => {
      console.log('doFacebookSignup success');
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
      console.log('doFacebookSignup error')

      //we don't have the user data so we will ask him to log in
      env.fbProvider.doFacebookLogin()
        .then(function (res) {
          console.log("doFacebookLogin res");
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

  // Used for signup with google
  doGoogleSignup() {
    console.log('doGoogleSignup')
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); // loader
    loading.present(); //loading present

    // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app
    let env = this;

    env.googleProvider.trySilentLogin()
      .then(data => {
        console.log('doGoogleSignup success')
        // user is previously logged with Google and we have his data we will let him access the app
        var resJson = JSON.parse(JSON.stringify(data));
        var socialInfo = {
          auth_id: resJson.userId,
          auth_type: 3,
          first_name: resJson.firstName,
          last_name: resJson.lastName,
          profile_image: resJson.image,
          email_id:resJson.userId + "@gmail.com"
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
        console.log('doGoogleSignup error');
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
              console.log("err social login")
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

  //Used to show the termof service page
  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  // Used for show privacy policy page
  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }


  signinAnonymous() { // firebase signin
    this.auth.createAnonymousAccount()
      .then((data) => {
        console.log("user data...", data)

      }, (error) => {
        this.alert.okAlertTitleMsg("Error", error.message);

      });
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
