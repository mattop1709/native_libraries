import { HttpBackend, HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

/** step 4 */
import { Plugins, FilesystemDirectory, FileWriteResult } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';

/** step 6 */
const { Filesystem, Storage } = Plugins;

/** step 9 */
const FILE_KEY = 'files';

@Component({
  selector: 'app-file',
  templateUrl: './file.page.html',
  styleUrls: ['./file.page.scss'],
})
export class FilePage implements OnInit {
  /** step 2 */
  downloadUrl: string = '';
  myFiles: any[] = [];
  downloadProgress: number = 0;

  /** step 21 */
  private customHttpClient: HttpClient;

  /** step 3 */
  path = 'https://file-examples-com.github.io/uploads/2017';
  pdfUrl = `${this.path}/10/file-example_PDF_1MB.pdf`;
  videoUrl = `${this.path}/04/file_example_MP4_640_3MG.mp4`;
  imageUrl = `${this.path}/10/file_example_PNG_1MB.png`;

  /** step 5 */
  constructor(
    /** step 22 */
    private fileOpener: FileOpener,
    private backend: HttpBackend
  ) {
    /** step 7 */
    this.onLoadFile();

    /** step 23 */
    this.customHttpClient = new HttpClient(backend);
  }

  ngOnInit() {}

  /** step 8 */
  async onLoadFile(): Promise<any> {
    const videoList = await Storage.get({ key: FILE_KEY });
    this.myFiles = JSON.parse(videoList.value) || [];
  }

  /** step 12 */
  convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  /** step 15 */
  onGetFileType(name: string): string {
    if (name.indexOf('pdf') >= 0) {
      return 'application/pdf';
    } else if (name.indexOf('png')) {
      return 'image/png';
    } else {
      return 'video/mp4';
    }
  }

  /** step 10 */
  onDownload(url: string): void {
    /** step 11 */
    console.log(url);

    /** step 13 */
    /** step 24 to not use interceptor */
    this.customHttpClient
      .get(url, {
        responseType: 'blob',
        reportProgress: true,
        observe: 'events',
      })
      .subscribe(async event => {
        console.log(`this is the event ${JSON.stringify(event)}`);
        if (event.type === HttpEventType.DownloadProgress) {
          this.downloadProgress = Math.round(
            (100 * event.loaded) / event.total
          );
        } else if (event.type === HttpEventType.Response) {
          this.downloadProgress = 0;

          const name = url.substr(url.lastIndexOf('/') + 1);
          const base64 = <string>await this.convertBlobToBase64(event.body);

          const fileSaved: FileWriteResult = await Filesystem.writeFile({
            path: name,
            data: base64,
            directory: FilesystemDirectory.Documents,
          });

          /** step 14 please comment out interceptors */
          // console.log(`data ${JSON.stringify(fileSaved)}`);
          alert(`data ${JSON.stringify(fileSaved)}`);

          /** step 16 */
          const path = fileSaved.uri;
          const fileType = this.onGetFileType(name);

          /** step 17 */

          this.fileOpener
            .open(path, fileType)
            .then(() => {})
            .catch(error =>
              alert(`file opener error ${JSON.stringify(error)}`)
            );

          /** step 18 */
          this.myFiles.unshift(path);

          /** step 19 */
          Storage.set({
            key: FILE_KEY,
            value: JSON.stringify(this.myFiles),
          });
        }
      });
  }
}
