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
    <Mapclick @coords="getCoords"></Mapclick>
  </div>
</template>

<script>
//import { uid } from 'quasar'
//require('md-gum-polyfill')
import Navbar from "../components/Navbar";
import Mapclick from "../components/MapClick";
import Camera from "../components/Camera";
import { ref } from "vue";
import useStorage from "../composables/useStorage";
import useCollection from "../composables/useCollection";

export default {
  name: "CameraPage",
  components: { Navbar, Mapclick, Camera },
  setup() {
    const locationStr = ref("");

    const caption = ref("caption");
    let data = {
      caption: caption.value,
      coords: location,
      pic: "",
    };

    const { url, storageError, upLoadImage } = useStorage();
    const { error, addDoc } = useCollection("geopics");

    const handleSubmit = () => {};
    const getCoords = (e) => {
      locationStr.value = `${e.lat} ${e.lng}`;

      data.coords = e;
      data.caption = caption.value;
      console.log(data);
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
    };
    return { locationStr, getCoords, savePost, caption, getPhoto };
  },
};
</script>

<style >
</style>
