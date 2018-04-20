import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerBankDetailsPage } from './customer-bank-details';

@NgModule({
  declarations: [
    CustomerBankDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerBankDetailsPage),
  ],
  exports: [
    CustomerBankDetailsPage
  ]
})
export class CustomerBankDetailsPageModule {}
