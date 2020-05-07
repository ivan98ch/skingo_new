import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthConstants } from './../config/auth-constants';
import { HttpService } from './http.service';


import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { User } from '../models/user.model';
import { UserEmail } from '../models/userEmail.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private toastService: ToastService
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap( user => {
          if ( user ) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
      } )
    );
  }

  async googleSignIn() {
    const credential = await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
    /* console.log(credential.user); */
    this.googleUpdateUserData(credential.user);
    return this.router.navigate(['home']);
  }

  private googleUpdateUserData( user ) {
    // Insertamos la informacion del usuario en Firestorm
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const completeName = user.displayName.split(' ', 3);

    const data = {
      uid: user.uid,
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
      this.toastService.presentToast(
        'El email o la contraseña son incorrectos, intentalo de nuevo'
      );
      console.log('Error en el Login', err);
    }
  }

  async emailRegister( user: UserEmail ) {
    try {
      return await this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
        .then( userRegistered => {
            this.emailUpdateUserData(user, userRegistered.user.uid);
            this.router.navigate(['/home']);
        });
    } catch (err) {
      if ( err.code === 'auth/email-already-in-use' ) {
        this.toastService.presentToast(
          'Ya existe un email como este, intenta con otro..'
        );
      } else {
        this.toastService.presentToast(
          'Datos del incorrectos, por favor revisa todos los campos'
        );
      }
      console.log('Error en el Registro', err);
    }
  }

  private emailUpdateUserData( userData: UserEmail, userUid ) {
    // Insertamos la informacion del usuario en Firestorm
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${userUid}`);

    const data = {
      uid: userUid,
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
