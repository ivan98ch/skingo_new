import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { UserModel } from '../models/userModel.model';


@Injectable({
  providedIn: 'root'
})
export class UserUpdateService {


  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) {}

  getUserData() {
    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${this.authService.userUid}`);
    return userRef.valueChanges();
  }

  updateUserData(userData: UserModel) {
    const data = {
      email: userData.email,
      name: userData.name,
      firstSurname: userData.firstSurname,
      secondSurname: userData.secondSurname,
      gender: userData.gender,
      birthDate: userData.birthDate
    };

    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${this.authService.userUid}`);
    return userRef.set(data, { merge: true });
  }


}
