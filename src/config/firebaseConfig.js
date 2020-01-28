import firebase from 'firebase/app';
import 'firebase/auth';
import  'firebase/database';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyABkZcNaoR0UHkFPm_rKhHUmwctVRHOkbo",
  authDomain: "mario-plan-by-net-ninja.firebaseapp.com",
  databaseURL: "https://mario-plan-by-net-ninja.firebaseio.com",
  projectId: "mario-plan-by-net-ninja",
  storageBucket: "mario-plan-by-net-ninja.appspot.com",
  messagingSenderId: "469447778877",
  appId: "1:469447778877:web:2c1087296dee8d61a24054",
  measurementId: "G-BPYPMC7ST0"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export { firebaseConfig }
export default firebase;