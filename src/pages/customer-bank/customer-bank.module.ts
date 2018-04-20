import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerBankPage } from './customer-bank';

@NgModule({
  declarations: [
    CustomerBankPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerBankPage),
  ],
  exports: [
    CustomerBankPage
  ]
})
export class CustomerBankPageModule {}
