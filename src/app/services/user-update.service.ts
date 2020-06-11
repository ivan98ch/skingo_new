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

  postData: UserModel = {
    name: '',
    firstSurname: '',
    secondSurname: '',
    gender: '',
    birthDate: '',
    email: '',
    isPremium: 0,
    isAdmin: 0,
    totalPhotoMade: 0,
    firstPhotoDate: '',
    uid: '',
  };

  getUserData() {
    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${this.guard.userUID}`);
    return userRef.valueChanges();
  }

  updateUserData(userData: UserModel) {
    this.postData = userData;
    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${this.guard.userUID}`);
    return userRef.set(this.postData, { merge: true });
  }

  async passwordUpdate(password) {
    return (await this.afAuth.currentUser).updatePassword(password);
  }

  async getUserProvider() {
    return (await this.afAuth.currentUser).providerData;
  }

  sumOneToPhotoMade(postData) {
    this.postData = postData;
    this.postData.totalPhotoMade = this.postData.totalPhotoMade + 1;
    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${this.guard.userUID}`);
    return userRef.update(this.postData);
  }

  updateFirstPhotoDate(postData) {
    this.postData = postData;
    this.postData.firstPhotoDate = new Date().toString();
    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${this.guard.userUID}`);
    return userRef.update(this.postData);
  }

  updateZeroToPhotoMade(postData) {
    this.postData = postData;
    this.postData.totalPhotoMade = 0;
    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${this.guard.userUID}`);
    return userRef.update(this.postData);
  }

  setUserToPremium(postData) {
    this.postData = postData;
    this.postData.isPremium = 1;
    const userRef: AngularFirestoreDocument<UserModel> = this.afs.doc(`users/${this.guard.userUID}`);
    return userRef.update(this.postData);
  }


}
