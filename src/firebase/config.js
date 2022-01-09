import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCFHga_0ObxjRF30hSWaWFClbLRWc_Wdqo",
    authDomain: "track-my-finance.firebaseapp.com",
    projectId: "track-my-finance",
    storageBucket: "track-my-finance.appspot.com",
    messagingSenderId: "723400916399",
    appId: "1:723400916399:web:f544f23882729b3c7e435a"
  };


//Initialize Firebase App
firebase.initializeApp(firebaseConfig);

//Firestore Service
const db = firebase.firestore();

//Authentication Service
const auth = firebase.auth();

//Timestamp
const timestamp = firebase.firestore.Timestamp;

export {db, auth, timestamp};