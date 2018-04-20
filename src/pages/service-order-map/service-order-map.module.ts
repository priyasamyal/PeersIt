import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceOrderMapPage } from './service-order-map';

@NgModule({
  declarations: [
    ServiceOrderMapPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceOrderMapPage),
  ],
  exports: [
    ServiceOrderMapPage
  ]
})
export class ServiceOrderMapPageModule {}
