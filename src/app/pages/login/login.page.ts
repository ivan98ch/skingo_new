import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { StorageService } from './../../services/storage.service';
import { ToastService } from './../../services/toast.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  postData = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    public authService: AuthService,
    private toastService: ToastService,
    private platform: Platform
  ) {}

  ngOnInit() {}

  googleLogin() {
    if (this.platform.is('android')) {
      this.authService.nativeGoogleSignIn();
    } else {
      this.authService.googleSignIn();
    }
  }

  validateInputs() {
    const username = this.postData.email.trim();
    const password = this.postData.password.trim();
    return (
      this.postData.email &&
      this.postData.password &&
      username.length > 0 &&
      password.length > 0
    );
  }

  async onLogin() {
    if (this.validateInputs()) {
      await this.authService.emailSignIn(this.postData);
    } else {
      this.toastService.presentToastError(
        'Please enter email/username or password.'
      );
    }
  }
}
