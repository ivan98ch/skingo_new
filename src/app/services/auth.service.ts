import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HttpService } from './http.service';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { ToastService } from './toast.service';
import { UserModel } from '../models/userModel.model';
import { UserRegisterModel } from '../models/userRegisterModel.model';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private toastService: ToastService,
    private platform: Platform,
    private glplus: GooglePlus
  ) {}


  async googleSignIn() {
    try {
      await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider()).then( credential => {
        this.afs.collection('users').doc(`${credential.user.uid}`).valueChanges().subscribe( response => {
          if ( response === null || response === undefined ) {
            this.googleUpdateUserData(credential.user);
          }
        });
      });
      return this.router.navigate(['home']);
    } catch (error) {
      console.log('Google Login: ' + error);
    }

  }

  async nativeGoogleSignIn() {
      return await this.glplus.login({}).then( gplusUser => {
        return this.afAuth.signInWithCredential( auth.GoogleAuthProvider.credential(null, gplusUser.accessToken )).then( credential => {
         return this.afs.collection('users').doc(`${credential.user.uid}`).valueChanges().subscribe( response => {
            if ( response === null || response === undefined ) {
              this.googleUpdateUserData(credential.user);
            }
            return this.router.navigate(['home']);
          });
         });
      });
  }

  private googleUpdateUserData( user ) {
    // Insertamos la informacion del usuario en Firestorm
    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${user.uid}`);

    const completeName = user.displayName.split(' ', 3);

    const data = {
      email: user.email,
      name: completeName != null && completeName[0] != null ? completeName[0] : '',
      firstSurname: completeName != null && completeName[1] != null ? completeName[1] : '',
      secondSurname: completeName != null && completeName[2] != null ? completeName[2] : '',
      gender: '',
      birthDate: '',
      isPremium: 0,
      isAdmin: 0,
      totalPhotoMade: 0,
      firstPhotoDate: new Date().toString(),
    };

    return userRef.set(data, { merge: true });
  }

  async emailSignIn( user ) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(user.email, user.password).then( info => {
         this.router.navigate(['/home']);
      });

    } catch (err) {
      this.toastService.presentToastError(
        'El email o la contraseña son incorrectos, intentalo de nuevo'
      );
      console.log('Error en el Login', err);
    }
  }

  async emailRegister( user: UserRegisterModel ) {
    try {
      return await this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
        .then( userRegistered => {
            this.emailUpdateUserData(user, userRegistered.user.uid);
            this.router.navigate(['/home']);
        });
    } catch (err) {
      if ( err.code === 'auth/email-already-in-use' ) {
        this.toastService.presentToastError(
          'Ya existe un email como este, intenta con otro...'
        );
      } else {
        this.toastService.presentToastError(
          'Datos del incorrectos, por favor revisa todos los campos'
        );
      }
      console.log('Error en el Registro', err);
    }
  }

  private emailUpdateUserData( userData: UserRegisterModel, userUid ) {
    // Insertamos la informacion del usuario en Firestorm
    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${userUid}`);

    const data = {
      email: userData.email,
      name: userData.name,
      firstSurname: userData.firstSurname,
      secondSurname: userData.secondSurname,
      gender: userData.gender,
      birthDate: userData.birthDate,
      isPremium: 0,
      isAdmin: 0,
      totalPhotoMade: 0,
      firstPhotoDate: new Date().toString(),
    };

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.signOut();
    if (this.platform.is('android')) {
      this.glplus.logout();
    }
    return this.router.navigate(['']);
  }






}
