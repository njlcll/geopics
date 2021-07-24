<template>
  <div class="">
    <Navbar />

    <Camera @photoClick="getPhoto"></Camera>

    <div class="row">
      <div class="col-6">project : {{ project }}</div>
      <div class="col-4 text-end">mode : {{ modeStr }} {{ locationStr }}</div>
      <div class="col-2 text-end">
        <span class="compass" @click="setCurrentLoc">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-compass"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"
            />
            <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z" />
          </svg>
        </span>
      </div>
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
 
    const caption = ref("");
    let project = ref(null);
    const modeStr = ref("Cur Loc.");
    let navId = null;

    const setCurrentLoc = () => {
      startGeoTracking();
      modeStr.value = "Cur Loc.";
    };
    const myPos = (pos) => {
     
      console.log("getting coords", pos.coords.latitude);
      modeStr.value = "current Loc";
      data.coords.lat = pos.coords.latitude;
      data.coords.lng = pos.coords.longitude;
      locationStr.value = `${Math.round(pos.coords.latitude * 100000) / 1000000},${
        Math.round(pos.coords.longitude * 100000) / 100000
      }`;
    };

    const geoErr = (err) => {
      console.warn("ERROR(" + err.code + "): " + err.message);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const startGeoTracking = () => {
      navId = navigator.geolocation.watchPosition(myPos, geoErr, options);
    };

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
      navigator.geolocation.clearWatch(navId);
      locationStr.value = `${Math.round(e.lat * 100000) / 1000000},${
        Math.round(e.lng * 100000) / 100000
      }`;

      //
      modeStr.value = "Map Click";
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
  
    };

    startGeoTracking();
    return {
      locationStr,
      getCoords,
      savePost,
      caption,
      getPhoto,
   
      loading,
      project,
      modeStr,
      setCurrentLoc,
    };
  },
};
</script>

<style >
</style>
