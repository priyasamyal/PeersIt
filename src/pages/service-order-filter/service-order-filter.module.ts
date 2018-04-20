import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceOrderFilterPage } from './service-order-filter';

@NgModule({
  declarations: [
    ServiceOrderFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceOrderFilterPage),
  ],
  exports: [
    ServiceOrderFilterPage
  ]
})
export class ServiceOrderFilterPageModule {}
