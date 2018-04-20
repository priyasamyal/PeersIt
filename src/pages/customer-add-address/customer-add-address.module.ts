import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerAddAddressPage } from './customer-add-address';

@NgModule({
  declarations: [
    CustomerAddAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerAddAddressPage),
  ],
  exports: [
    CustomerAddAddressPage
  ]
})
export class CustomerAddAddressPageModule {}
