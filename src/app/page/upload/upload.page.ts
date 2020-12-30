import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Image } from 'src/app/interface/image';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {
  // upload task and initiate image from database
  task: AngularFireUploadTask;
  private imageCollection: AngularFirestoreCollection<Image>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  //File details
  imageURL: string;
  imageSize: number;
  selectedFile: File;

  //Status check
  percentage: number = 0;
  isUploading: boolean = false;
  isUploaded: boolean = false;
  images: Image[] = [];

  constructor(
    private fireStorage: AngularFireStorage,
    private fireStore: AngularFirestore,
    private loadingController: LoadingController
  ) {
    //Set collection where our documents/ images info will save
    this.imageCollection = fireStore.collection<Image>('tutorialStorage');
  }

  ngOnInit(): void {
    this.onGetImages();
  }

  async onGetImages(): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Downloading Images...',
    });
    this.fireStore
      .collection('tutorialStorage')
      .valueChanges()
      .subscribe(
        (images: Image[]) => {
          this.images = images;
          loading.dismiss();
          console.log('get image done');
        },
        error => {
          loading.dismiss();
          console.log('error');
        }
      );
    loading.present();
  }

  onSelect(file: FileList): void {
    console.log(file.item(0));
    const image = file.item(0);
    image.size >= 1e6
      ? console.log('image size too big')
      : ((this.selectedFile = image), console.log('image size okay'));
  }

  onCheckType(): void {
    const image = this.selectedFile;
    if (image.type.split('/')[0] === 'image') {
      this.onUploadFile(image);
      console.log(`file type okay to upload --> ${image}`);
    } else {
      console.log(`file type not supported --> ${image}`);
    }
  }

  onUploadFile(image: File): void {
    this.isUploading = true;
    this.isUploaded = false;

    /** main task */
    const path = `tutorialStorage/${new Date().getTime()}_${image.name}`;
    this.task = this.fireStorage.upload(path, image);
    console.log('upload done');

    this.onGetPercentage(this.fireStorage.ref(path), image);
  }

  onGetPercentage(fileRef: any, file: File): void {
    this.task.percentageChanges().subscribe(
      (progress: number) => {
        this.percentage = progress;
      },
      error => console.log(`error from calculate progress ${error}`)
    );

    this.snapshot = this.task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(
          (url: string) => {
            this.imageURL = url;
            this.onAddImagetoDB({
              name: file.name,
              filepath: url,
              size: this.imageSize,
            });
            this.isUploading = false;
            this.isUploaded = true;
          },
          (error: any) => {
            console.error(error);
          }
        );
      }),
      tap((snap: any) => {
        this.imageSize = snap.totalBytes;
      })
    );
  }

  onAddImagetoDB(payload: Image): void {
    //Create an ID for document
    const id = this.fireStore.createId();

    //Set document id with value in database
    this.imageCollection
      .doc(id)
      .set(payload)
      .then(() => {
        console.log('done');
      })
      .catch((error: any) => {
        console.log('error ' + error);
      });
  }
}
