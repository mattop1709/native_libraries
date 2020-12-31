import { HttpBackend, HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

/** step 4 */
import { Plugins, FilesystemDirectory } from '@capacitor/core';
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
  myFiles: string[] = [];
  downloadProgress: number = 0;

  /** step 3 */
  path = 'https://file-examples-com.github.io/uploads/2017';
  pdfUrl = `${this.path}/10/file-example_PDF_1MB.pdf`;
  videoUrl = `${this.path}/04/file_example_MP4_640_3MG.mp4`;
  imageUrl = `${this.path}/10/file_example_PNG_1MB.png`;

  /** step 21 */
  private customHttpClient: HttpClient;

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
          const param = {
            path: name,
            data: <string>await this.convertBlobToBase64(event.body),
            directory: FilesystemDirectory.Documents,
          };
          const savedFile = await Filesystem.writeFile({ ...param });

          /** step 14 please comment out interceptors */
          // alert(`data ${JSON.stringify(savedFile)}`);

          /** step 16 */
          this.onOpenFile(savedFile['uri'], this.onGetFileType(name));

          /** step 18 */
          // this.onStoreFile(savedFile['uri']);
        }
      });
  }

  /** step 17 */
  onOpenFile(file: string, path: string): void {
    this.fileOpener
      .open(file, path)
      .then(() => {})
      .catch(error => alert(`file opener error ${JSON.stringify(error)}`));
  }

  /** step 19 */
  onStoreFile(path: string): void {
    this.myFiles.unshift(path);
    alert(`on store ${JSON.stringify(this.myFiles.length)}`);
    Storage.set({
      key: FILE_KEY,
      value: JSON.stringify(this.myFiles),
    });
  }
}
