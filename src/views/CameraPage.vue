<template>
  <div class="container-fluid">
    <Navbar />
    <Camera @photoClick="uploadPhoto"></Camera>
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

    const { url, filePath, error, upLoadImage } = useStorage();

    const handleSubmit = () => {};
    const getCoords = (e) => {
      locationStr.value = `${e.lat} ${e.lng}`;

      data.coords = e;
      data.caption = caption.value;
      console.log(data);
    };

    const savePost = () => {
      console.log("save post");
    };

    const uploadPhoto = async (e) => {
      console.log("upload photo in c page", e);

      await upLoadImage(e);

      console.log("image uploaded ", url.value, error.value);
    };
    return { locationStr, getCoords, savePost, caption, uploadPhoto };
  },
};
</script>

<style >
</style>
