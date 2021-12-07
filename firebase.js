import * as firebase from 'firebase'

import "firebase/firestore"
import "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDBbmuRRemQnqMrSssKBfChTG_EaE1ko4U",
  authDomain: "the-class-chat.firebaseapp.com",
  projectId: "the-class-chat",
  storageBucket: "the-class-chat.appspot.com",
  messagingSenderId: "808183021153",
  appId: "1:808183021153:web:39ef94078698b9daa93420"
};

  let app;

  if  (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
  } else {
    app = firebase.app()
  }

  const db = app.firestore();
  const auth = firebase.auth();

  export { db, auth };
