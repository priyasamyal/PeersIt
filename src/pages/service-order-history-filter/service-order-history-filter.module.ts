import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceOrderHistoryFilterPage } from './service-order-history-filter';

@NgModule({
  declarations: [
    ServiceOrderHistoryFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceOrderHistoryFilterPage),
  ],
  exports: [
    ServiceOrderHistoryFilterPage
  ]
})
export class ServiceOrderHistoryFilterPageModule {}
