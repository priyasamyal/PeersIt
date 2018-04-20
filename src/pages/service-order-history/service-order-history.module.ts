import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceOrderHistoryPage } from './service-order-history';

@NgModule({
  declarations: [
    ServiceOrderHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceOrderHistoryPage),
  ],
  exports: [
    ServiceOrderHistoryPage
  ]
})
export class ServiceOrderHistoryPageModule {}
