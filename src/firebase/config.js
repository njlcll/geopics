
import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore';
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "",
    authDomain: "chat-66c42.firebaseapp.com",
    databaseURL: "https://chat-66c42.firebaseio.com",
    projectId: "chat-66c42",
    storageBucket: "chat-66c42.appspot.com",
    messagingSenderId: "591166683363",
    appId: ""
  };

  //init app
  firebase.initializeApp(firebaseConfig)

  //init services
  const projectAuth = firebase.auth()
  const projectFirestore = firebase.firestore()
  const projectStorage = firebase.storage()
  const timestamp = firebase.firestore.FieldValue.serverTimestamp()
  
  export { projectAuth, projectFirestore, timestamp, projectStorage }