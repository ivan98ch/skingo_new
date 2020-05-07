import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Crop } from '@ionic-native/crop/ngx';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {

  // tslint:disable-next-line: ban-types
  image: string;
  // tslint:disable-next-line: ban-types
  image2: string;
  // tslint:disable-next-line: ban-types
  url: string;
  // tslint:disable-next-line: ban-types
  filename: string;
  // tslint:disable-next-line: ban-types
  completeUrl: string;

  constructor(private camera: Camera, private webView: WebView, private crop: Crop) {

  }

  async takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    const tempImage =  await this.camera.getPicture(options);
    this.camera.getPicture(options)
    .then((file) => {
      this.url = tempImage.substr(0, tempImage.lastIndexOf('/') + 1);
      this.filename = tempImage.substr(tempImage.lastIndexOf('/') + 1);
      this.completeUrl = this.url + '' + this.filename;
      this.image = this.webView.convertFileSrc(file);
    }, (err) => {
     console.log ('Error al hacer la foto: ' + err);
    });
  }

  async takeFromGallery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    const tempImage =  await this.camera.getPicture(options);
    this.camera.getPicture(options)
    .then((file) => {
      this.url = tempImage.substr(0, tempImage.lastIndexOf('/') + 1);
      this.filename = tempImage.substr(tempImage.lastIndexOf('/') + 1);
      this.completeUrl = this.url + '' + this.filename;
      this.image2 = this.webView.convertFileSrc(file);
    }, (err) => {
     console.log ('Error al recuperar la foto de la galeria: ' + err);
    });
  }

  cropPicture() {
    this.crop.crop(this.completeUrl, {quality: 100}).then(
      newImage => console.log('La nueva ruta es: ' + newImage),
      error => console.error('Error al recortar la imagen', error)
    );
  }

  ngOnInit() {
  }

}
