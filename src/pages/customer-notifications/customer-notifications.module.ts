import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerNotificationsPage } from './customer-notifications';

@NgModule({
  declarations: [
    CustomerNotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerNotificationsPage),
  ],
  exports: [
    CustomerNotificationsPage
  ]
})
export class CustomerNotificationsPageModule {}
