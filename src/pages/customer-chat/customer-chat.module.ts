import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerChatPage } from './customer-chat';

@NgModule({
  declarations: [
    CustomerChatPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerChatPage),
  ],
  exports: [
    CustomerChatPage
  ]
})
export class CustomerChatPageModule {}
