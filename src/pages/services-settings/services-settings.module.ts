import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicesSettingsPage } from './services-settings';

@NgModule({
  declarations: [
    ServicesSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicesSettingsPage),
  ],
  exports: [
    ServicesSettingsPage
  ]
})
export class ServicesSettingsPageModule {}
