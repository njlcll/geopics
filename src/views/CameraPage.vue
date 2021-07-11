<template>
  <div class="container-fluid">
    <Navbar />
    <Camera />
    <div class="row justify-center q-ma-md">
      caption<input class="col col-sm-6" label="Caption" dense />
    </div>
    <div class="row justify-center q-ma-md">
      Location
      <input
        v-model="locationStr"
        class="col col-sm-6"
        label="Location"
        dense
      />
    </div>
    <div class="row justify-center q-mt-lg">
      <button color="primary" label="Post Image" @click="savePost">
        Save
      </button>
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

export default {
  name: "CameraPage",
  components: { Navbar, Mapclick, Camera },
  data() {
    return {
      locationStr: "",
    };
  },
  methods: {
    getCoords(e) {
      console.log("coords gotten", e);
      this.locationStr = `${e.lat} ${e.lng}`;
    },
    savePost(){
      console.log('save post')
    }
  },
};
</script>

<style >
</style>
