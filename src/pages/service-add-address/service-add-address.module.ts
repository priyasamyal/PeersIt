import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceAddAddressPage } from './service-add-address';

@NgModule({
  declarations: [
    ServiceAddAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceAddAddressPage),
  ],
  exports: [
    ServiceAddAddressPage
  ]
})
export class ServiceAddAddressPageModule {}
