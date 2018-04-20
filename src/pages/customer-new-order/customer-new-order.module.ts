import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerNewOrderPage } from './customer-new-order';

@NgModule({
  declarations: [
    CustomerNewOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerNewOrderPage),
  ],
  exports: [
    CustomerNewOrderPage
  ]
})
export class CustomerNewOrderPageModule {}
