import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HttpService } from './http.service';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { ToastService } from './toast.service';
import { UserModel } from '../models/userModel.model';
import { UserRegisterModel } from '../models/userRegisterModel.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpService: HttpService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private toastService: ToastService
  ) {}

  async googleSignIn() {
    const credential = await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
    this.afs.collection('users').doc(`${credential.user.uid}`).valueChanges().subscribe( response => {
      if ( response === null || response === undefined ) {
        this.googleUpdateUserData(credential.user);
        this.toastService.presentToastSuccess(
          'Entra de nuevo para confirmar tu registro, gracias'
        );
      }
    });
    return this.router.navigate(['home']);
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
      birthDate: null
    };

    return userRef.set(data, { merge: true });
  }

  async emailSignIn( user ) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(user.email, user.password)
        .then( fun => {
          this.router.navigate(['/home']);
        }
      );

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
      birthDate: userData.birthDate
    };

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['']);
  }






}
