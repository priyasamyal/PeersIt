import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceOrderListPage } from './service-order-list';

@NgModule({
  declarations: [
    ServiceOrderListPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceOrderListPage),
  ],
  exports: [
    ServiceOrderListPage
  ]
})
export class ServiceOrderListPageModule {}
