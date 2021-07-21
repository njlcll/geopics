import { ref, watchEffect } from 'vue'
import { projectFirestore } from '../firebase/config'
import {getProject } from "./localStorage"

const getCollection = (collection, where) => {

  const documents = ref(null)
  const error = ref(null)
  let project = ref(null)

  let collectionRef
  project.value= getProject()

  // register the firestore collection reference
  if(where){
   collectionRef = projectFirestore.collection(collection)
    .where('project', '==', project.value)
  }else{
     collectionRef = projectFirestore.collection(collection)
    .orderBy('created_at', "desc")
  }

  
  const unsub = collectionRef.onSnapshot(snap => {
  
    let results = []
    snap.docs.forEach(doc => {
     
      // must wait for the server to create the timestamp & send it back
      // we don't want to edit data until it has done this
  
      doc.data().created_at && results.push({...doc.data(), id: doc.id})
     
    });
    
    
    documents.value = results
  
    error.value = null
  }, err => {
    console.log(err.message)
    documents.value = null
    error.value = 'could not fetch the data'
  })

  watchEffect((onInvalidate) => {
    
    // unsub from prev collection when watcher is stopped (component unmounted)
    onInvalidate(() => unsub());
  });

  return { error, documents, where }
}

export default getCollection 