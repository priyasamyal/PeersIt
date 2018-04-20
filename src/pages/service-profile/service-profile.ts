import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ActionSheetController, LoadingController, MenuController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { ServiceAddressPage } from '../service-address/service-address';
import { ServiceHomePage } from '../service-home/service-home';

import { Api } from '../../providers/api/api';
import { AlertProvider } from '../../providers/alert/alert';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

declare var cordova: any;

/**
 * Generated class for the ServiceProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-service-profile',
  templateUrl: 'service-profile.html',
})
export class ServiceProfilePage {
  profileForm: FormGroup;
  profilePic: any;
  maxStart: any = new Date().toISOString();
  show: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public api: Api,
    public alert: AlertProvider,
    public userProvider: UserProvider,
    public camera: Camera,
    private file: File,
    private filePath: FilePath,
    public platform: Platform,
    private loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController
  ) {
    console.log("ServiceProfilePage constructor");
    console.log(this.userProvider.user);
    console.log(this.api.imageUrl + this.userProvider.user.profile_image);
    console.log(this.userProvider.user.dob);
    console.log(new Date(this.userProvider.user.dob));
    if (!this.userProvider.user.dob) {
      this.menu.enable(false);
      this.show = false;
    }
    this.profileForm = new FormGroup({
      first_name: new FormControl(this.userProvider.user.first_name, Validators.compose([Validators.pattern('[a-zA-Z]*'), Validators.required])),
      last_name: new FormControl(this.userProvider.user.last_name ? this.userProvider.user.last_name : '', Validators.compose([Validators.pattern('[a-zA-Z]*'), Validators.required])),
      organization: new FormControl(this.userProvider.user.organization ? this.userProvider.user.organization : ''),
      dob: new FormControl(this.userProvider.user.dob ? this.userProvider.user.dob : new Date(new Date().setFullYear(new Date().getFullYear() - 20)).toISOString(), Validators.required),
      gender: new FormControl(this.userProvider.user.gender, Validators.required),
      mobile_no: new FormControl(this.userProvider.user.mobile_no ? this.userProvider.user.mobile_no : '', Validators.required),
    });
    if (this.userProvider.user.profile_image) {
      if (this.userProvider.user.profile_image.includes("facebook") || this.userProvider.user.profile_image.includes("google"))
        this.profilePic = this.userProvider.user.profile_image;
      else
        this.profilePic = this.api.imageUrl + this.userProvider.user.profile_image;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceProfilePage');
  }

  // Used to setroot service address page for add address  
  addAddress() {
    this.navCtrl.setRoot(ServiceAddressPage);
  }

  doProfile() {
    console.log("doProfile")
    let loading = this.loadingCtrl.create({ content: 'Please Wait' }); //loader create
    loading.present(); // loading present
    console.log(this.profileForm.value);
    this.profileForm.value.dob = this.profileForm.value.dob.split('T')[0];
    this.profileForm.value.user_id = this.userProvider.user.id;
    this.profileForm.value.token = this.userProvider.token;
    this.userProvider.updateProfile(this.profileForm.value).then(data => {
      console.log("this.userProvider.updateProfile success");
      loading.dismiss(); // loading dismiss
      console.log(data);
      this.navCtrl.setRoot(ServiceHomePage);
    }, err => {
      console.log("updateProfile err")
      loading.dismiss(); // loading dismiss
      console.log(err)
      this.alert.okAlertTitleMsg("Error", err);
    })
  }

  // Used to open camera through camera plugin
  getPicture() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  //take a picture with the camera
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      console.log('Error while selecting image');
    });
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    let loading = this.loadingCtrl.create({ content: 'Please Wait...' }); //loader create
    loading.present(); // loading present
    console.log("copyFileToLocalDir");
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      loading.dismiss(); // loading dismiss
      this.profilePic = cordova.file.dataDirectory + newFileName;
      console.log(this.profilePic);
      this.userProvider.updateProfileImage(this.profilePic).then(data => {
        loading.dismiss(); // loading dismiss
        console.log("this.userProvider.updateProfileImage success");
      }, err => {
        loading.dismiss(); // loading dismiss
        console.log("updateProfileImage err")
        console.log(err)
        this.alert.okAlertTitleMsg("Error", err);
      })

    }, error => {
      loading.dismiss(); // loading dismiss
      console.log('Error while storing file');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  getProfileImageStyle() {
    return 'url(' + this.profilePic + ')'
  }

}
