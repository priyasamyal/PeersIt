import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { GooglePlus } from '@ionic-native/google-plus';
import { NativeStorage } from '@ionic-native/native-storage';

/*
  Generated class for the GoogleProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
export class GoogleUserModel {
  image: string;
  email: string;
  name: string;
  userId: string;
}

@Injectable()
export class GoogleProvider {

  webClientId: string = "465762637660-3vo0fqhk4fgvv8te48io9v1aoc2e3ho6.apps.googleusercontent.com";

  constructor(
    public http: Http,
    public nativeStorage: NativeStorage,
    public googlePlus: GooglePlus
  ) {
    console.log('Hello GoogleProvider Provider');
  }
  trySilentLogin() {
    //checks if user is already signed in to the app and sign them in silently if they are.
    let env = this;
    return new Promise<GoogleUserModel>((resolve, reject) => {
      env.googlePlus.trySilentLogin({
        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': this.webClientId, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true
      })
        .then(function (user) {
          env.setGoogleUser(user)
            .then(function (res) {
              resolve(res);
            });
        }, function (error) {
          reject(error);
        });
    });
  }
  // Used to login to google from the app
  doGoogleLogin() {
    let env = this;

    return new Promise<GoogleUserModel>((resolve, reject) => {

      env.googlePlus.login({
        'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': this.webClientId, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true
      })
        .then(function (user) {
          env.setGoogleUser(user)
            .then(function (res) {
              resolve(res);
            });
        }, function (error) {
          reject(error);
        });
    });
  }

  // used for google logout
  doGoogleLogout() {
    let env = this;
    return new Promise((resolve, reject) => {
      this.googlePlus.logout()
        .then(function (response) {
          //user logged out so we will remove him from the NativeStorage
          env.nativeStorage.remove('google_user');
          resolve();
        }, function (error) {
          reject(error);
        });
    });
  }

  // used to get the google user's information
  getGoogleUser() {
    return this.nativeStorage.getItem('google_user');
  }
  //Set the googleuser for the app using 
  setGoogleUser(user: any) {
    console.log('setGoogleUser');
    console.log(user);

    let env = this;
    return new Promise<GoogleUserModel>((resolve, reject) => {
      resolve(env.nativeStorage.setItem('google_user',
        {
          userId: user.userId,
          firstName: user.displayName.split(" ")[0],
          lastName: user.displayName.split(" ").pop(),
/*           firstName: user.givenName,
          lastName: user.familyName,
 */          email: user.email,
          image: user.imageUrl
        })
      );
    });
  }

}
