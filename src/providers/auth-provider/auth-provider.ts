import { Injectable } from '@angular/core';
import { AngularFire, AuthMethods } from 'angularfire2';


@Injectable()
export class AuthProvider {
  constructor(public af:AngularFire) {}
  
  //used to sign in
  signin(credentails) {   
    return this.af.auth.login(credentails);
  }
  
  //used to create account
  createAccount(credentails) {
    return this.af.auth.createUser(credentails);
  };

//used for anonymous accounts
   createAnonymousAccount() {
    return  this.af.auth.login({
      method: AuthMethods.Anonymous
    })
  };

//used for logout  
  logout() {
     this.af.auth.logout();
  }
}


