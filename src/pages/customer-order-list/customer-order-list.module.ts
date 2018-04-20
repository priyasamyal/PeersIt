import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerOrderListPage } from './customer-order-list';

@NgModule({
  declarations: [
    CustomerOrderListPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerOrderListPage),
  ],
  exports: [
    CustomerOrderListPage
  ]
})
export class CustomerOrderListPageModule {}
