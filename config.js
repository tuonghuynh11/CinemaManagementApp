import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyBQ7aSitkA2S2aM6iZma1POL3zllMb47Pc",
  authDomain: "cinemamanagement-5a867.firebaseapp.com",
  projectId: "cinemamanagement-5a867",
  storageBucket: "cinemamanagement-5a867.appspot.com",
  messagingSenderId: "1042971070359",
  appId: "1:1042971070359:web:6b58b4f65ab14d46eafed2",
  measurementId: "G-FJKM20KLXP",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
