import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerOrderInvoicePage } from './customer-order-invoice';

@NgModule({
  declarations: [
    CustomerOrderInvoicePage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerOrderInvoicePage),
  ],
  exports: [
    CustomerOrderInvoicePage
  ]
})
export class CustomerOrderInvoicePageModule {}
