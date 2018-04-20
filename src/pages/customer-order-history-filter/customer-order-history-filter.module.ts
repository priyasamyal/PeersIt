import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerOrderHistoryFilterPage } from './customer-order-history-filter';

@NgModule({
  declarations: [
    CustomerOrderHistoryFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerOrderHistoryFilterPage),
  ],
  exports: [
    CustomerOrderHistoryFilterPage
  ]
})
export class CustomerOrderHistoryFilterPageModule {}
