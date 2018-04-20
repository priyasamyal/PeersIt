import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerOrderDetailsPage } from './customer-order-details';

@NgModule({
  declarations: [
    CustomerOrderDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerOrderDetailsPage),
  ],
  exports: [
    CustomerOrderDetailsPage
  ]
})
export class CustomerOrderDetailsPageModule {}
