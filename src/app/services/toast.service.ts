import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(public toastController: ToastController) {}

  async presentToastError(infoMessage: string) {
    const toast = await this.toastController.create({
      message: infoMessage,
      duration: 2000,
      color: 'danger',
      cssClass: 'toast-wrapper'
    });
    toast.present();
  }

  async presentToastSuccess(infoMessage: string) {
    const toast = await this.toastController.create({
      message: infoMessage,
      duration: 2000,
      color: 'success',
      cssClass: 'toast-wrapper'
    });
    toast.present();
  }
}
