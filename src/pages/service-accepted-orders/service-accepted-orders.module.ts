import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceAcceptedOrdersPage } from './service-accepted-orders';

@NgModule({
  declarations: [
    ServiceAcceptedOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceAcceptedOrdersPage),
  ],
  exports: [
    ServiceAcceptedOrdersPage
  ]
})
export class ServiceAcceptedOrdersPageModule {}
