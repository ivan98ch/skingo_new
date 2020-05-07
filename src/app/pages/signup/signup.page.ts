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
    return (
      this.postData.name && this.postData.firstSurname && this.postData.email &&
      this.postData.password && this.postData.repeatPassword && this.postData.gender &&
      name.length > 0 && firstSurname.length > 0 && email.length > 0 &&
      password.length > 0 && repeatPassword.length > 0 && gender.length > 0 && this.postData.birthDate != null
    );
  }

  async onRegister() {

    this.postData.birthDate = this.pipe.transform(this.postData.birthDate, 'dd/MM/yyyy');
    // console.log(this.postData);

    if (this.validateInputs()) {
      // Datos correctos
      await this.authService.emailRegister(this.postData);
    } else {
      // Datos incorrectos
      this.toastService.presentToast(
        'Datos del incorrectos, por favor revisa todos los campos'
      );
    }
  }


}
