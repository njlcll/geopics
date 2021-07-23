<template>
  <div class="">
    <Navbar />

    <Camera @photoClick="getPhoto"></Camera>

    <div class="row">
      <div class="col-6">project : {{ project }}</div>
      <div class="col-6 text-end">mode : {{modeStr}} {{ locationStr }}</div>
    </div>
    <div class="row">
    
      <div class="col-12 constrain-more">
        <input
          class="form-control"
          id="caption"
          v-model="caption"
          placeholder="add caption"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-12 text-center ">
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
    <Mapclick @coords="getCoords"></Mapclick>
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
import { projectAuth } from "../firebase/config";
import { getProject } from "../composables/localStorage";

export default {
  name: "CameraPage",
  components: { Navbar, Mapclick, Camera, TestGet },
  setup() {
    const locationStr = ref("");
    const componentKey = ref(0);
    const caption = ref("");
    let project = ref(null);
    const  modeStr = ref("Cur Loc.")
    let data = {
      caption: caption.value,
      coords: location,
      pic: "",
      project: "Demo",

      created_at: timestamp,
    };
    project = getProject();

    const loading = ref(false);
    const { url, storageError, upLoadImage } = useStorage(project);
    const { error, addDoc } = useCollection("geopics");

    const getCoords = (e) => {
      locationStr.value = `${Math.round(e.lat * 100000) / 1000000},${
        Math.round(e.lng * 100000) / 100000
      }`;
      console.log(e);
      //
      modeStr.value = "Map Click"
      const slightOffset = {
        lat: e.lat + Math.random() / 10000,
        lng: e.lng + Math.random() / 10000,
      };
      data.coords = slightOffset;
    };

    const getPhoto = (e) => {
      
 
      data.pic = e;
    };

    const savePost = async (e) => {
      loading.value = true;
      url.value = null;
      storageError.value = false;

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

      data.caption = caption.value;
      data.project = project;
      const user = projectAuth.currentUser;
      data.user = user.uid;

      await addDoc(data);

      loading.value = false;
      // componentKey.value++;
    };
    return {
      locationStr,
      getCoords,
      savePost,
      caption,
      getPhoto,
      componentKey,
      loading,
      project,
      modeStr
    };
  },
};
</script>

<style >
</style>
