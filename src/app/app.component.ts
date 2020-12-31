import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Router } from '@angular/router';
import { InboxService } from './service/inbox.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  API_KEY = '3e30024b-d969-4b48-b800-f44673d57b1f';
  SENDER_ID = '534578511442';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private router: Router,
    private inboxService: InboxService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
      /** for push notification */
      // this.platform.is('cordova')
      //   ? this.initializePush()
      //   : console.error('please use real device');
    });
  }

  initializePush() {
    this.oneSignal.startInit(this.API_KEY, this.SENDER_ID);

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.None
    );

    /** will be triggered if user click the banner from home */
    this.oneSignal
      .handleNotificationOpened()
      .subscribe(data => this.onAddInbox(data));

    this.oneSignal
      .handleNotificationReceived()
      .subscribe(data =>
        alert(
          `this is from handle notification received ${JSON.stringify(
            data.payload.additionalData
          )}`
        )
      );

    this.oneSignal.endInit();
  }

  async onAddInbox(data: any): Promise<void> {
    const { additionalData } = data.notification.payload;
    const message = {
      title: additionalData.title,
      message: additionalData.message,
    };
    await this.inboxService.createMessage({ ...message });
    this.router.navigateByUrl('/inbox');
  }
}
