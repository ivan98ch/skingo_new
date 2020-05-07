import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './../../services/auth.service';
import { ToastService } from './../../services/toast.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {

  postData = {
    name: '',
    firstSurname: '',
    secondSurname: '',
    email: '',
    password: '',
    repeatPassword: '',
    gender: '',
    birthDate: null
  };

  pipe = new DatePipe('en-US');


  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {}

  validateInputs() {
    const name = this.postData.name.trim();
    const firstSurname = this.postData.firstSurname.trim();
    const email = this.postData.email.trim();
    const password = this.postData.password.trim();
    const repeatPassword = this.postData.repeatPassword.trim();
    const gender = this.postData.gender.trim();
    if ( this.postData.name && this.postData.firstSurname && this.postData.email &&
         this.postData.password && this.postData.repeatPassword && this.postData.gender &&
         name.length > 0 && firstSurname.length > 0 && email.length > 0 &&
         password.length > 0 && repeatPassword.length > 0 && gender.length > 0 &&
         this.postData.birthDate != null  ) {
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

  async onRegister() {

    this.postData.birthDate = this.pipe.transform(this.postData.birthDate, 'dd/MM/yyyy');
    // console.log(this.postData);

    if ( this.validateInputs() && this.validatePassword() ) {
        // Datos correctos
        await this.authService.emailRegister(this.postData);
    }
  }


}
