import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerAddressPage } from './customer-address';

@NgModule({
  declarations: [
    CustomerAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerAddressPage),
  ],
  exports: [
    CustomerAddressPage
  ]
})
export class CustomerAddressPageModule {}
