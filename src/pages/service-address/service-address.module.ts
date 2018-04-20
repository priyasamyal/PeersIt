import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceAddressPage } from './service-address';

@NgModule({
  declarations: [
    ServiceAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceAddressPage),
  ],
  exports: [
    ServiceAddressPage
  ]
})
export class ServiceAddressPageModule {}
