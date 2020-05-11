import { Component, OnInit } from '@angular/core';
import { UserUpdateService } from '../../services/user-update.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { UserRegisterModel } from 'src/app/models/userRegisterModel.model';
import { UserModel } from 'src/app/models/userModel.model';

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
  };
  postData: UserModel = {
    name: '',
    firstSurname: '',
    secondSurname: '',
    gender: '',
    birthDate: '',
    email: '',
  };

  constructor(
    private userUpdateService: UserUpdateService,
    public auth: AuthService,
    private toastService: ToastService
    ) {}

  ngOnInit() {
    this.userUpdateService.getUserData().subscribe( postData => {
      this.postData = postData;
    } );
  }

  updateUser() {
    if ( this.validateInputs() && this.validatePassword() ) {
      this.userUpdateService.updateUserData(this.postData).then( response => {
        this.userData.password = '';
        this.userData.repeatPassword = '';
        this.toastService.presentToastSuccess(
          'Se ha modificado correctamente el usuario.'
        );
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
    const password = this.userData.password.trim();
    const repeatPassword = this.userData.repeatPassword.trim();
    if ( this.postData.name && this.postData.firstSurname &&
         this.userData.password && this.userData.repeatPassword &&
         name.length > 0 && firstSurname.length > 0  &&
         password.length > 0 && repeatPassword.length > 0  ) {
        return true;
    } else {
      this.toastService.presentToastError(
        'Datos insertados incorrectos, por favor revisa todos los campos'
      );
      return false;
    }
  }

  validatePassword() {
    if ( this.userData.password === this.userData.repeatPassword ) {
      return true;
    }
    this.toastService.presentToastError(
      'Las contraseñas no coinciden, por favor revisa los campos'
    );
    return false;
  }


}
