import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerSecretCodeListPage } from './customer-secret-code-list';

@NgModule({
  declarations: [
    CustomerSecretCodeListPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerSecretCodeListPage),
  ],
  exports: [
    CustomerSecretCodeListPage
  ]
})
export class CustomerSecretCodeListPageModule {}
