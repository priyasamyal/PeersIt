import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerEditOrderPage } from './customer-edit-order';

@NgModule({
  declarations: [
    CustomerEditOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerEditOrderPage),
  ],
  exports: [
    CustomerEditOrderPage
  ]
})
export class CustomerEditOrderPageModule {}
