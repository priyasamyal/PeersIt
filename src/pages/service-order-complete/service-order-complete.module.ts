import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceOrderCompletePage } from './service-order-complete';

@NgModule({
  declarations: [
    ServiceOrderCompletePage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceOrderCompletePage),
  ],
  exports: [
    ServiceOrderCompletePage
  ]
})
export class ServiceOrderCompletePageModule {}
