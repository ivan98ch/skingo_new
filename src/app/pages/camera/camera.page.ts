import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize } from 'rxjs/operators';
import { ToastService } from '../../services/toast.service';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})

export class CameraPage implements OnInit {

    data = '';

    constructor(
        private camera: Camera,
        private file: File,
        private http: HttpClient,
        private webview: WebView,
        private actionSheetController: ActionSheetController,
        private toastController: ToastController,
        private storage: Storage,
        private plt: Platform,
        private loadingController: LoadingController,
        private ref: ChangeDetectorRef,
        private filePath: FilePath,
        private platform: Platform,
        private toastService: ToastService,
    ) { }

  ngOnInit() { }

    pathForImage( img ) {
        if (img === null) {
            return '';
        } else {
            const converted = this.webview.convertFileSrc(img);
            return converted;
        }
    }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
        buttons: [{
                text: 'Galería',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
            {
                text: 'Cámara',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.CAMERA);
                }
            },
            {
                text: 'Cancelar',
                role: 'cancel'
            }
        ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    const options: CameraOptions = {
        quality: 100,
        sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
        this.startUpload(imagePath);
    });
  }


startUpload(imagePath) {
  this.file.resolveLocalFilesystemUrl( imagePath )
      .then(entry => {
          ( entry as FileEntry ).file(file => this.readFile(file));
      })
      .catch(err => {
        this.toastService.presentToastError('Error while reading file.');
      });
}

readFile(file: any) {
  const reader = new FileReader();
  reader.onload = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
          type: file.type
      });
      formData.append('image', imgBlob, file.name);
      this.uploadImageData(formData);
  };
  reader.readAsArrayBuffer(file);
}

async uploadImageData(formData: FormData) {
  const loading = await this.loadingController.create({
      message: 'Consultando Imagen...',
  });
  await loading.present();

  const endPoint = 'https://buscadorproductosimagen.cognitiveservices.azure.com/bing/v7.0/images/visualsearch';
  const headers: HttpHeaders = new HttpHeaders({
    'Ocp-Apim-Subscription-Key': '14b28ea4a801419faa6f15e769862ba0',
    'X-BingApis-SDK': 'true',
    'Content-Type': 'multipart/form-data'
  });
  const options = { headers };


  this.http.post(endPoint, formData, options)
      .pipe(
          finalize(() => {
              loading.dismiss();
          })
      )
      .subscribe(res => {
        if ( res['tags'] && res['tags'][0] && res['tags'][0]['actions'] ) {

            res['tags'][0]['actions'].forEach(element => {
                if(element['actionType'] == 'ProductVisualSearch'){

                }
                console.log();
            });

        }
      });
}

parseResponse(json) {
    var dict = [];
    for (var i =0; i < json.tags.length; i++) {
        var tag = json.tags[i];

        if (tag.displayName === '') {
            dict.push({
                key: 'Default',
                value: JSON.stringify(tag)
            });
            // dict.('Default', JSON.stringify(tag));
            // dict['Default'] = JSON.stringify(tag);
        } else {
            dict.push({
                key: tag.displayName,
                value: JSON.stringify(tag)
            });
            // dict[tag.displayName] = JSON.stringify(tag);
        }
    }
    return(dict);
}

}
