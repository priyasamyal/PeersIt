import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceOrderMapListPage } from './service-order-map-list';

@NgModule({
  declarations: [
    ServiceOrderMapListPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceOrderMapListPage),
  ],
  exports: [
    ServiceOrderMapListPage
  ]
})
export class ServiceOrderMapListPageModule {}
