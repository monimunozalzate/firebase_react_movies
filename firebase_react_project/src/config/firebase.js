// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANIt44S3P2Mu_-EudmhcFrWmyUoiVomtU",
  authDomain: "fir-course-6ee2c.firebaseapp.com",
  projectId: "fir-course-6ee2c",
  storageBucket: "fir-course-6ee2c.appspot.com",
  messagingSenderId: "376295666512",
  appId: "1:376295666512:web:de72061f1a41802189f255",
  measurementId: "G-KKZJ8JKWC1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore();
export const storage = getStorage(app);
// const analytics = getAnalytics(app);
