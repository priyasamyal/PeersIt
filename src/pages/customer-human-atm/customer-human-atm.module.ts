import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerHumanAtmPage } from './customer-human-atm';

@NgModule({
  declarations: [
    CustomerHumanAtmPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerHumanAtmPage),
  ],
  exports: [
    CustomerHumanAtmPage
  ]
})
export class CustomerHumanAtmPageModule {}
