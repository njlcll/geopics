<template>
  <div class="">
    <Navbar />

    <Camera @photoClick="getPhoto"></Camera>
    <div class="row">
      <div class="col-12 constrain-more">
        <label for="caption" class="form-label">caption</label>
        <input class="form-control" id="caption" v-model="caption" />
      </div>
    </div>

    <div class="row">
      <div class="col-12 constrain-more">
        <label for="location" class="form-label">location</label>
        <input v-model="locationStr" class="form-control" id="location" />
      </div>
    </div>

    <div class="row">
      <div class="col-12 text-center">
        <button
          class="btn-dark m-3"
          id="btnsave"
          label="Post Image"
          @click="savePost"
        >
          Save
        </button>

        <div
          v-if="loading"
          class="spinner-border spinner-border-sm"
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <Mapclick @coords="getCoords" :key="componentKey"></Mapclick>
  </div>
</template>

<script>
//import { uid } from 'quasar'
//require('md-gum-polyfill')
//https://github.com/jawj/OverlappingMarkerSpiderfier
import Navbar from "../components/Navbar";
import Mapclick from "../components/MapClick";
import TestGet from "../components/TestGet.vue";
import Camera from "../components/Camera";
import { ref } from "vue";
import { timestamp } from "../firebase/config";
import useStorage from "../composables/useStorage";
import useCollection from "../composables/useCollection";
import {getProject} from "../composables/localStorage"
export default {
  name: "CameraPage",
  components: { Navbar, Mapclick, Camera, TestGet },
  setup() {
    const locationStr = ref("");
    const componentKey = ref(0);
    const caption = ref("");
    let data = {
      caption: caption.value,
      coords: location,
      pic: "",
      created_at: timestamp,
    };
    
    const loading = ref(false);
    const { url, storageError, upLoadImage } = useStorage(getProject());
    const { error, addDoc } = useCollection("geopics");

    const getCoords = (e) => {
      locationStr.value = `${e.lat} ${e.lng}`;
      console.log(e)
//
      const slightOffset = {
        lat : e.lat + (Math.random() / 10000),
        lng : e.lng + (Math.random() / 10000)
      }
      data.coords = slightOffset;
    
    };

    const getPhoto = (e) => {
      console.log("getPhoto", e);
      data.pic = e;
    };

    const savePost = async (e) => {

      
      loading.value = true;
      url.value = null;
      storageError.value = false

      if (data.pic) {
        await upLoadImage(data.pic);
      }

      //console.log("image uploaded ", url.value, storageError.value);

      if (!storageError.value) {
        data.pic = url.value;
        console.log("pic uploaded ", data.pic);
      } else {
        console.log("err", storageError.value);
      }

      data.caption = caption.value

    
      await addDoc(data);
      //forces map reset
      loading.value = false;
      componentKey.value++;
    };
    return {
      locationStr,
      getCoords,
      savePost,
      caption,
      getPhoto,
      componentKey,
      loading,
    };
  },
};
</script>

<style >
</style>
