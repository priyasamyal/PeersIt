import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceNotificationsPage } from './service-notifications';

@NgModule({
  declarations: [
    ServiceNotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceNotificationsPage),
  ],
  exports: [
    ServiceNotificationsPage
  ]
})
export class ServiceNotificationsPageModule {}
