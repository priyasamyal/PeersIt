import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerChatViewPage } from './customer-chat-view';

@NgModule({
  declarations: [
    CustomerChatViewPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerChatViewPage),
  ],
  exports: [
    CustomerChatViewPage
  ]
})
export class CustomerChatViewPageModule {}
