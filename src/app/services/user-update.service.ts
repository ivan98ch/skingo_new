import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserUpdateService {


  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) {}

  getUserData() {
    return this.afs.collection('users').doc(`${this.auth.userUid}`).valueChanges();
  }

  updateUserData(userData) {
    const data = {
      email: userData.email,
      name: userData.name,
      firstSurname: userData.firstSurname,
      secondSurname: userData.secondSurname,
      gender: userData.gender,
      birthDate: userData.birthDate
    };

    return this.afs.doc(`users/${this.auth.userUid}`).set(data, { merge: true });

  }


}
