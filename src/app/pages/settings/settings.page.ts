import { Component, OnInit } from '@angular/core';
import { UserUpdateService } from '../../services/user-update.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {

  postData = {
    name: '',
    firstSurname: '',
    secondSurname: '',
    email: '',
    password: '',
    repeatPassword: '',
    gender: '',
    birthDate: ''
  };

  constructor(
    private userUpdateService: UserUpdateService,
    public auth: AuthService,
    private toastService: ToastService
    ) {}

  ngOnInit() {
    this.userUpdateService.getUserData().subscribe( userData => {
      this.postData.name = userData.name;
      this.postData.firstSurname = userData.firstSurname;
      this.postData.secondSurname = userData.secondSurname;
      this.postData.email = userData.email;
      this.postData.gender = userData.gender;
      this.postData.birthDate = userData.birthDate;
    } );
  }

  updateUser(){
    if ( this.validateInputs() && this.validatePassword() ) {
      this.userUpdateService.updateUserData(this.postData).then( response => {
        this.postData.password = '';
        this.postData.repeatPassword = '';
        this.toastService.presentToastSuccess(
          'Se ha modificado correctamente el usuario.'
        );
      }, err =>{
        this.toastService.presentToastError(
          'Error inesperado: ' + err
        );
      });
    }
  }

  validateInputs() {
    console.log(this.postData);
    const name = this.postData.name.trim();
    const firstSurname = this.postData.firstSurname.trim();
    const password = this.postData.password.trim();
    const repeatPassword = this.postData.repeatPassword.trim();
    if ( this.postData.name && this.postData.firstSurname &&
         this.postData.password && this.postData.repeatPassword &&
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
    if ( this.postData.password === this.postData.repeatPassword ) {
      return true;
    }
    this.toastService.presentToastError(
      'Las contraseñas no coinciden, por favor revisa los campos'
    );
    return false;
  }


}
