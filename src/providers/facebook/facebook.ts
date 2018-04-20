import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';

/*
  Generated class for the FacebookProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FacebookProvider {

  constructor(public http: Http,
              public nativeStorage: NativeStorage,
              public fb: Facebook
  ) {
    console.log('Hello FacebookProvider Provider');
  }

// Used to login to the app via facebook
  doFacebookLogin()
  {
    console.log("doFacebookLogin");
    let env = this;

    return new Promise((resolve, reject) => {
    console.log("doFacebookLogin Promise");
      //["public_profile"] is the array of permissions, you can add more if you need
      this.fb.login(["public_profile", "email"]).then(function(response){

        console.log("doFacebookLogin Promise login");
        //Getting name and gender properties
        env.fb.api("/me?fields=first_name,last_name,gender,email", [])
        .then(function(user) {
          console.log("doFacebookLogin Promise login then");

          //now we have the users info, let's save it in the NativeStorage
          env.setFacebookUser(user)
          .then(function(res){
            resolve(res);
          });
        })
      }, function(error){
        reject(error);
      });
    });
  }

// Used for facebook logout  
  doFacebookLogout()
  {
    let env = this;

    return new Promise((resolve, reject) => {
      this.fb.logout()
      .then(function(res) {
        //user logged out so we will remove him from the NativeStorage
        env.nativeStorage.remove('facebook_user');
        resolve();
      }, function(error){
        reject();
      });
    });
  }

 // get facebook user
  getFacebookUser()
  {
    return this.nativeStorage.getItem('facebook_user');
  }
  
// set the facebook user as app user
  setFacebookUser(user: any)
  {
    console.log("setFacebookUser");
    return new Promise((resolve, reject) => {
      resolve(this.nativeStorage.setItem('facebook_user',
        {
          userId: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          gender: user.gender,
          email: user.email,
          image: "https://graph.facebook.com/" + user.id + "/picture?type=large"
        })
      );
    });
  }

}
