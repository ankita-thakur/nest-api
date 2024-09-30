import { Injectable } from '@nestjs/common';
import firebaseConfig from './firebase-config';
import * as firebase from 'firebase-admin';
import 'firebase/auth';

@Injectable()
export class FirebaseApp {
  private firebaseApp: firebase.app.App;

  constructor() {
    this.firebaseApp = firebase.initializeApp({
      credential: firebase.credential.cert({ ...firebaseConfig }),
      databaseURL: process.env.DATABASE_URL,
    });
  }

  getAuth = (): firebase.auth.Auth => {
    return this.firebaseApp.auth();
  };

  firestore = (): firebase.firestore.Firestore => {
    return this.firebaseApp.firestore();
  };

  bucket = () => {
    return this.firebaseApp.storage().bucket();
  };

  messaging = () => {
    return this.firebaseApp.messaging();
  }
}
