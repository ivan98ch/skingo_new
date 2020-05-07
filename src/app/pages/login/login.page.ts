import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { StorageService } from './../../services/storage.service';
import { ToastService } from './../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  postData = {
    username: '',
    password: ''
  };

  constructor(
    private router: Router,
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  validateInputs() {
    console.log(this.postData);
    const username = this.postData.username.trim();
    const password = this.postData.password.trim();
    return (
      this.postData.username &&
      this.postData.password &&
      username.length > 0 &&
      password.length > 0
    );
  }

  async onLogin() {
    if (this.validateInputs()) {
      await this.authService.emailSignIn(this.postData);
    } else {
      this.toastService.presentToast(
        'Please enter email/username or password.'
      );
    }
  }
}
