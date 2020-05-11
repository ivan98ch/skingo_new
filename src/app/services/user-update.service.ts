import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { UserModel } from '../models/userModel.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { HomeGuard } from '../guards/home.guard';


@Injectable({
  providedIn: 'root'
})
export class UserUpdateService {

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private guard: HomeGuard
  ) {}

  getUserData() {
    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${this.guard.userUID}`);
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

    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${this.guard.userUID}`);
    return userRef.set(data, { merge: true });
  }


}
