import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerOrderRunningListPage } from './customer-order-running-list';

@NgModule({
  declarations: [
    CustomerOrderRunningListPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerOrderRunningListPage),
  ],
  exports: [
    CustomerOrderRunningListPage
  ]
})
export class CustomerOrderRunningListPageModule {}
