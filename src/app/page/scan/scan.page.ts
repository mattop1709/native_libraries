import { Component, OnDestroy, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@ionic-native/in-app-browser/ngx';
import { Code } from 'src/app/interface/code';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit, OnDestroy {
  data: Code;

  options: InAppBrowserOptions = {
    location: 'yes', //Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes', //Android only ,shows browser zoom controls
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'yes', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no', //iOS only
    presentationstyle: 'pagesheet', //iOS only
    fullscreen: 'yes', //Windows only
  };
  constructor(
    private barcodeScanner: BarcodeScanner,
    private inAppBrowser: InAppBrowser
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.data;
  }

  onScan(): void {
    this.barcodeScanner
      .scan()
      .then((response: Code) => {
        // alert(`barcode code ${JSON.stringify(response)}`);
        // this.data = response;
        if (response.text.includes('https://*')) {
          this.openWithCordovaBrowser(response.text);
        } else {
          this.data = response;
        }
      })
      .catch(error => alert(error));
  }

  openWithCordovaBrowser(url: string): void {
    let target = '_self';
    this.inAppBrowser.create(url, target, this.options);
  }
}
