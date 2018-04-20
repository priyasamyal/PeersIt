import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerPaymentOptionsPage } from './customer-payment-options';

@NgModule({
  declarations: [
    CustomerPaymentOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerPaymentOptionsPage),
  ],
  exports: [
    CustomerPaymentOptionsPage
  ]
})
export class CustomerPaymentOptionsPageModule {}
