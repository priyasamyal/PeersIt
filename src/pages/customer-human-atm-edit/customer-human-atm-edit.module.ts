import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerHumanAtmEditPage } from './customer-human-atm-edit';

@NgModule({
  declarations: [
    CustomerHumanAtmEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerHumanAtmEditPage),
  ],
  exports: [
    CustomerHumanAtmEditPage
  ]
})
export class CustomerHumanAtmEditPageModule {}
