import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ChatsProvider } from '../../providers/chats-provider/chats-provider';
import { UserProvider } from '../../providers/user/user';
import { UtilsProvider } from '../../providers/utils/utils';
/**
 * Generated class for the CustomerChatViewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customer-chat-view',
  templateUrl: 'customer-chat-view.html',
})
export class CustomerChatViewPage {
  message: string;
  uid: string;
  interlocutor: string;
  userName: string;
  reciever_id: any;
  orderDetail: any;
  chats: FirebaseListObservable<any>;
  reciverUserType: any;
  senderName:string;
  @ViewChild(Content) content: Content;
  constructor(
    public nav: NavController,
    public navParams: NavParams,
    public chatsProvider: ChatsProvider,
    public af: AngularFire,
    public userProvider: UserProvider,
    public utilsProvider: UtilsProvider
  ) {
    var params = this.navParams.get('params');
    console.log(params);
    this.uid = params.uid;
    this.interlocutor = params.interlocutor;

    this.reciever_id = params.recieverId;
    this.orderDetail = params.orderDetail;
    this.reciverUserType = params.reciverUserType;
    // Get Chat Reference

    
    // Used to Get Chat Reference

    chatsProvider.getChatRef(this.uid, this.interlocutor)
      .then((chatRef: any) => {
        this.chats = this.af.database.list(chatRef);
        this.content.scrollToBottom();
        console.log("chat of user.............", this.chats);
      });

    this.userProvider.getUserById(this.reciever_id).then((data) => {
      console.log("recievr data......", data);
      if(data[0].last_name!=null){
         this.userName = data[0].first_name + " " + data[0].last_name;
      }
     else{
      this.userName = data[0].first_name + " ";
    }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerChatViewPage');
  }

  ionViewDidEnter() {
    this.content.scrollToBottom();
  }

//Used for sending messages
  sendMessage() {
    this.content.scrollToBottom(300);
    if (this.message) {
      let chat = {
        from: this.uid,
        message: this.message,
        type: 'message'
      };
    
      this.chats.push(chat);
      this.message = "";
      if (this.userProvider.user.last_name != null) {
        this.senderName = this.userProvider.user.first_name +" "+ this.userProvider.user.last_name;
      }
      else {
        this.senderName = this.userProvider.user.first_name;
      }
      this.utilsProvider.sendPushNotification(this.reciever_id, this.senderName, this.orderDetail, this.reciverUserType);
    }
  };

  // sendPicture() {
  //     let chat = {from: this.uid, type: 'picture', picture:null};
  //     this.userProvider.getPicture()
  //     .then((image) => {
  //         chat.picture =  image;

  //         this.chats.push(chat);
  //     });
  // }
}
