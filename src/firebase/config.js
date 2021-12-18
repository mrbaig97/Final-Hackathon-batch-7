import * as firebase from '@firebase/app';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBqbS8i5Tyu54VcaTh6hNQhm887LnKrK6o',
  authDomain: 'saylani-hackthon-final.firebaseapp.com',
  projectId: 'saylani-hackthon-final',
  storageBucket: 'saylani-hackthon-final.appspot.com',
  messagingSenderId: '182844291425',
  appId: '1:182844291425:web:e8e21b4a7e53d9aea46d20',
  databaseURL: 'https://saylani-hackthon-final-default-rtdb.firebaseio.com/',
};

const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

export {
  firebase,
  db,
  auth,
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
};
