import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { finalize } from 'rxjs/operators';
import { ToastService } from '../../services/toast.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { StorageService } from '../../services/storage.service';
import { UserUpdateService } from '../../services/user-update.service';
import { UserModel } from '../../models/userModel.model';



@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})

export class CameraPage implements OnInit {

    data = [];

    postData: UserModel = {
        name: '',
        firstSurname: '',
        secondSurname: '',
        gender: '',
        birthDate: '',
        email: '',
        isPremium: 0,
        isAdmin: 0,
        totalPhotoMade: 0,
        firstPhotoDate: '',
        uid: '',
      };

    constructor(
        private camera: Camera,
        private file: File,
        private http: HttpClient,
        private webview: WebView,
        private actionSheetController: ActionSheetController,
        private loadingController: LoadingController,
        private ref: ChangeDetectorRef,
        private toastService: ToastService,
        private inAppBrowser: InAppBrowser,
        public storageService: StorageService,
        private userUpdateService: UserUpdateService,
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
        if (this.checkUserIfCanDoImage()) {
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
    }

    takePicture(sourceType: PictureSourceType) {
        const options: CameraOptions = {
            quality: 20,
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
                // console.log(res['tags'][0]['actions']);
                res['tags'][0]['actions'].forEach(element => {
                    if (element['actionType'] && element['actionType'] == 'ProductVisualSearch' /* ProductVisualSearch  PagesIncluding*/) {
                        this.data = element['data']['value'];
                        this.toastService.presentToastSuccess(
                            'Búsqueda realizada correctamente!'
                        );
                        this.userUpdateService.sumOneToPhotoMade(this.postData);
                    }
                });
                if (this.data.length === 0) {
                    this.toastService.presentToastError(
                        'No se han encontrado resultados para esta imagen :C. Inténtalo des de nuevo... Gracias'
                    );
                }
                this.ref.detectChanges();
            } else {
                this.toastService.presentToastError(
                    'Se ha producido un error en la carga de la imagen...'
                );
            }
          });
    }

    openBuyPage(url) {
        this.inAppBrowser.create(url);
    }

    checkUserIfCanDoImage(): boolean {
        this.userUpdateService.getUserData().subscribe( result => {
            this.postData = result;
        } );

        if (this.postData.isPremium === 1) {
            return true;
        }
        if (this.postData.totalPhotoMade < 10) {
            // TODO
            return true;
        }
        if (this.postData.totalPhotoMade >= 10 && this.calculateDiff(this.postData.firstPhotoDate) > 30) {
            this.userUpdateService.updateFirstPhotoDate(this.postData);
            // this.userUpdateService.updateZeroToPhotoMade(this.postData);
            // TODO
            return true;
        }
        if (this.postData.totalPhotoMade >= 10 && this.calculateDiff(this.postData.firstPhotoDate) < 30) {
            this.toastService.presentToastError(
                'Has superado el total de 10 fotos al mes al ser un usuario NO PREMIUM'
            );
            return false;
        }
    }

    calculateDiff(sentDate) {
        const date1: any = new Date(sentDate);
        const date2: any = new Date();
        const diffDays: any = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
        return diffDays;
    }


}
