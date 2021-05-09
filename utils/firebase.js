import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyB11ag65X0ZIJD4KJL1vMhkSIKtkjE192E",
    authDomain: "dogs-f56aa.firebaseapp.com",
    projectId: "dogs-f56aa",
    storageBucket: "dogs-f56aa.appspot.com",
    messagingSenderId: "145993913665",
    appId: "1:145993913665:web:62707aa0781a9f3bd3bdc0"
  }
 
  export const firebaseApp = firebase.initializeApp(firebaseConfig)
