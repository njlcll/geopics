<template>
  <div class="constrain-more">
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
    <div class="map">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed, onUnmounted } from "@vue/runtime-core";
import { ref, watch } from "vue";
import getCollection from "../composables/getCollection";

export default {
  setup(props, context) {
    const { error, documents } = getCollection("geopics", 1);

    let center = { lat: 57.948786899999995, lng: -5.1613893 };
    let map = ref(null);
    let marker;
    let markers = [];
    const modeStr = ref(null);

    let navId = null;
    let firstPointFound = false;

    const myCurrentPos = (pos) => {
      //console.log("getting coords", pos.coords.latitude);
      modeStr.value = "current Loc";
      marker.setMap(null);

      marker = new google.maps.Marker({
        position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        map: map.value,
      });
      context.emit("coords", {
        mode: "current",
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    };

    const geoErr = (err) => {
      console.warn("ERROR(" + err.code + "): " + err.message);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    const startGeoTracking = () => {
      navId = navigator.geolocation.watchPosition(
        myCurrentPos,
        geoErr,
        options
      );
    };

    const setCurrentLoc = () => {
      if (navId == null) {
        startGeoTracking();
        modeStr.value = "Cur Loc.";
      }
    };

    startGeoTracking();
    watch(
      () => documents.value,
      (state, prevState) => {
        
        markers = [];
        documents.value.forEach((doc) => {
          var icon = {
            path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
            fillColor: "#00FF00",
            fillOpacity: 0.6,
            anchor: new google.maps.Point(0, 0),
            strokeWeight: 0,
            scale: 0.35,
          };

          let slightOffset = {
            lat: doc.coords.lat + Math.random() / 5000,
            lng: doc.coords.lng + Math.random() / 5000,
          };

          if (!firstPointFound) {
            firstPointFound = true;
            const center = new google.maps.LatLng(
              slightOffset.lat,
              slightOffset.lng
            );
            // using global variable:
            map.value.panTo(center);
          }
          const photoMarker = new google.maps.Marker({
            position: { lat: slightOffset.lat, lng: slightOffset.lng },
            map: map.value,
            icon,
          });

          photoMarker.info = new google.maps.InfoWindow({
            content: `<div class = "MarkerPopUp" style="">
           <div class = "MarkerContext">${doc.caption} dd</div>
       
           </div>`,
          });

          google.maps.event.addListener(photoMarker, "click", function () {
            photoMarker.info.open(map.value, photoMarker);
            //geoImage.value = doc.pic;
          });
          markers.push(photoMarker);
        });

        let cluster = new MarkerClusterer(map.value, markers, {
          maxZoom: 14,
          imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        });
      }
    );

    const mapClick = (e) => {
      center.lat = e.latLng.lat();
      center.lng = e.latLng.lng();

      marker.setMap(null);

      marker = new google.maps.Marker({
        position: { lat: center.lat, lng: center.lng },
        map: map.value,
      });

      navigator.geolocation.clearWatch(navId);
      navId = null;

      context.emit("coords", {
        mode: "click",
        lat: center.lat,
        lng: center.lng,
      });
    };

    const showMap = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        center.lat = position.coords.latitude;
        center.lng = position.coords.longitude;

        map.value = new google.maps.Map(document.getElementById("map"), {
          center: { lat: center.lat, lng: center.lng },
          zoom: 8,
        });
        marker = new google.maps.Marker({
          position: { lat: center.lat, lng: center.lng },
          map: map.value,
        });
        //getPoints();
        //  context.emit("coords", { lat: center.lat, lng: center.lng });
        google.maps.event.addListener(map.value, "click", mapClick);
      }),
        (err) => {
          console.log(err), { timeout: 7000 };
        };
    };

    onMounted(() => {
      showMap();
    });

    onUnmounted(() => {
      navigator.geolocation.clearWatch(navId);
      navId = null;
    });
    return { map, documents, modeStr, setCurrentLoc };
  },
};
</script>

<style scoped>
</style>