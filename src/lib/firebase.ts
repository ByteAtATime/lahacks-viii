// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA1PLwLflBhFtrathW3hogJX1V4EQDu2yo',
  authDomain: 'lahacks-viii.firebaseapp.com',
  projectId: 'lahacks-viii',
  storageBucket: 'lahacks-viii.appspot.com',
  messagingSenderId: '658949840346',
  appId: '1:658949840346:web:ed7e7ed63b293aedad34e3'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
