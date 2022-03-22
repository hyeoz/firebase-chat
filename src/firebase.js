// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMuDzaxZp3CSifpUOxUbzXsReB1KUzUvM",
  authDomain: "react-firebase-chat-24c0d.firebaseapp.com",
  projectId: "react-firebase-chat-24c0d",
  storageBucket: "react-firebase-chat-24c0d.appspot.com",
  messagingSenderId: "412487588076",
  appId: "1:412487588076:web:6d49b9991d3e303d76edc9",
  measurementId: "G-55R0DWBL2Z",
  databaseURL:
    "https://react-firebase-chat-24c0d-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const getUser = getAuth();
export const getReatimeDB = getDatabase();
