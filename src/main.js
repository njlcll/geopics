import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import {projectAuth} from '/src/firebase/config'


import './assets/main.css'

let app 
 
projectAuth.onAuthStateChanged(() =>{
    if(!app){
        app = true
        app = createApp(App)
   
    .use(router)
   
    .mount('#app')

    }
})

