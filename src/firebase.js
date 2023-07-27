// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBs0sEBhtrylICNQ6bIQqAQJzqmhlXVWrk",
  authDomain: "realtor-clone-react-4ad07.firebaseapp.com",
  projectId: "realtor-clone-react-4ad07",
  storageBucket: "realtor-clone-react-4ad07.appspot.com",
  messagingSenderId: "303321262208",
  appId: "1:303321262208:web:166c51702bd57094ac1e65"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()