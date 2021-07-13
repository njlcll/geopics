<template>
  <div class="container-fluid">
    <Navbar />
   
    <Camera @photoClick="getPhoto"></Camera>
    <div class="row justify-center">
      caption
      <input class="col col-sm-6" label="Caption" v-model="caption" />
    </div>
    <div class="row justify-center">
      Location
      <input
        v-model="locationStr"
        class="col col-sm-6"
        label="Location"
        dense
      />
    </div>
    <div class="row justify-center q-mt-lg">
      <button color="primary" label="Post Image" @click="savePost">Save</button>
    </div>
    <Mapclick @coords="getCoords" :key="componentKey"></Mapclick>
  </div>
</template>

<script>
//import { uid } from 'quasar'
//require('md-gum-polyfill')
import Navbar from "../components/Navbar";
import Mapclick from "../components/MapClick";
import TestGet from "../components/TestGet.vue"
import Camera from "../components/Camera";
import { ref } from "vue";
import { timestamp } from '../firebase/config'
import useStorage from "../composables/useStorage";
import useCollection from "../composables/useCollection";

export default {
  name: "CameraPage",
  components: { Navbar, Mapclick, Camera, TestGet },
  setup() {
    const locationStr = ref("");
    const componentKey = ref(0)
    const caption = ref("caption");
    let data = {
      caption: caption.value,
      coords: location,
      pic: "",
      created_at: timestamp
    };

    const { url, storageError, upLoadImage } = useStorage();
    const { error, addDoc } = useCollection("geopics");

  
    const getCoords = (e) => {
      locationStr.value = `${e.lat} ${e.lng}`;

      data.coords = e;
      data.caption = caption.value;
     
    };

    const getPhoto = (e) => {
      console.log("getPhoto", e);
      data.pic = e;
    };

    const savePost = async (e) => {
    
      await upLoadImage(data.pic );

      //console.log("image uploaded ", url.value, storageError.value);

      if (!storageError.value) {
        data.pic = url.value;
        console.log("record uploaded ", data.pic);
      } else {
        console.log("err", storageError.value);
      }
      await addDoc(data);
      //forces map reset
      componentKey.value ++
    };
    return { locationStr, getCoords, savePost, caption, getPhoto, componentKey };
  },
};
</script>

<style >
</style>
