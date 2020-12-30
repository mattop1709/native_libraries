import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UploadPageRoutingModule } from './upload-routing.module';
import { UploadPage } from './upload.page';
import { FileSizePipe } from 'src/app/pipe/file-size.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, UploadPageRoutingModule],
  declarations: [UploadPage, FileSizePipe],
})
export class UploadPageModule {}
