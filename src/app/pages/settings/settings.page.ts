import { Component, OnInit } from '@angular/core';
import { UserUpdateService } from '../../services/user-update.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { UserRegisterModel } from 'src/app/models/userRegisterModel.model';
import { UserModel } from 'src/app/models/userModel.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { PayPal, PayPalPayment, PayPalConfiguration, PayPalPaymentDetails } from '@ionic-native/paypal/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {

  userData: UserRegisterModel = {
    name: '',
    firstSurname: '',
    secondSurname: '',
    gender: '',
    birthDate: '',
    email: '',
    password: '',
    repeatPassword: '',
    isPremium: 0,
    isAdmin: 0,
    totalPhotoMade: 0,
    firstPhotoDate: '',
  };
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
    private userUpdateService: UserUpdateService,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
    private toastService: ToastService,
    private payPal: PayPal
    ) {}

  ngOnInit() {
    this.userUpdateService.getUserData().subscribe( postData => {
      this.postData = postData;
    } );
  }

  updateUser() {
    if ( this.validateInputs() && this.updateUserPassword(this.userData.password) ) {
      this.userUpdateService.updateUserData(this.postData).then( response => {

      }, err => {
        this.toastService.presentToastError(
          'Error inesperado: ' + err
        );
      });
    }
  }

  validateInputs() {
    // console.log(this.userData);
    const name = this.postData.name.trim();
    const firstSurname = this.postData.firstSurname.trim();
    if ( this.postData.name && this.postData.firstSurname &&
         this.userData.password && this.userData.repeatPassword &&
         name.length > 0 && firstSurname.length > 0  ) {
        return true;
    } else {
      this.toastService.presentToastError(
        'Datos insertados incorrectos, por favor revisa todos los campos'
      );
      return false;
    }
  }


  updateUserPassword(password) {
    return this.userUpdateService.passwordUpdate(password).then( result => {
      this.toastService.presentToastSuccess(
        'Se ha modificado correctamente el usuario.'
      );
      return true;
    }, err => {
      this.toastService.presentToastError(
        'La contraseña no cumple los criterios minimos.'
      );
      console.log(err);
      return false;
    });
  }

  comprar() {
    this.payPal.init({
      PayPalEnvironmentProduction: '',
      PayPalEnvironmentSandbox: 'ARRwy1CvtFkobb64LewCgiDkxzTE6EMZPPqD1lH4wTvjm3GqSDlK0NS_6Hw32E5k_K8dbMkDnvoVSuBu'
    }).then(() => {
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        acceptCreditCards: true,
        languageOrLocale: 'es-ES',
        merchantName: 'Skingo',
        merchantPrivacyPolicyURL: '',
        merchantUserAgreementURL: ''
      })).then(() => {
        const detail = new PayPalPaymentDetails('15', '0', '0');
        const payment = new PayPalPayment('15','EUR','Skingo Premium', 'Sale', detail);
        this.payPal.renderSinglePaymentUI(payment).then(response => {
          console.log('Pago realizado');
          this.userUpdateService.setUserToPremium(this.postData).then(() => {
            this.toastService.presentToastSuccess(
              'Ahora eres PREMIUM!! Gracias por tu compra'
            );
          })
        });
      }, () =>{
        console.log('Error en la compra');
      } )
    })
  }


}
