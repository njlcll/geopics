
//npm install firebase
import firebase from "firebase";
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBDmsNxvbyFfLnlkd6zu7dxkhir8k3AVWs",
    authDomain: "chat-66c42.firebaseapp.com",
    databaseURL: "https://chat-66c42.firebaseio.com",
    projectId: "chat-66c42",
    storageBucket: "chat-66c42.appspot.com",
    messagingSenderId: "591166683363",
    appId: "1:591166683363:web:c143171e2b46339663edd6"
  };

  //init app
  firebase.initializeApp(firebaseConfig)

  //init services
  const projectAuth = firebase.auth()
  const projectFirestore = firebase.firestore()
  const projectStorage = firebase.storage()
  const timestamp = firebase.firestore.FieldValue.serverTimestamp()
  
  export { projectAuth, projectFirestore, timestamp, projectStorage }