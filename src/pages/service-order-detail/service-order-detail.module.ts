import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceOrderDetailPage } from './service-order-detail';

@NgModule({
  declarations: [
    ServiceOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceOrderDetailPage),
  ],
  exports: [
    ServiceOrderDetailPage
  ]
})
export class ServiceOrderDetailPageModule {}
