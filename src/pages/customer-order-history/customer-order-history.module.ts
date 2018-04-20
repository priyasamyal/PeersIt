import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerOrderHistoryPage } from './customer-order-history';

@NgModule({
  declarations: [
    CustomerOrderHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerOrderHistoryPage),
  ],
  exports: [
    CustomerOrderHistoryPage
  ]
})
export class CustomerOrderHistoryPageModule {}
