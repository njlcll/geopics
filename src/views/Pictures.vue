<template>
  <div class="p">
    <Navbar />

    <div class="constrain-more">
      <div class="map">
        <div id="map"></div>
      </div>
    </div>

    <div v-if="error">{{ error }}</div>

    <div class="row">
      <div class="col-12 p-3 text-center">
        <img :src="geoImage" class="img-fluid" />
      </div>
    </div>
  </div>
</template>

<script>
import getCollection from "../composables/getCollection";
import { computed, watchEffect, onMounted, ref } from "vue";
import { formatDistanceToNow } from "date-fns";
import Navbar from "../components/Navbar";
export default {
  components: { Navbar },
  setup() {
    const { error, documents } = getCollection("geopics", true);
    let geoImage = ref("");
    let center = { lat: 57.948786899999995, lng: -5.1613893 };
    let map = ref(null);
    let markers = [];
    let intTimer = null;
    let firstPointFound = false;

    watchEffect(() => {
      if (!map.value || !documents.value) {
        return;
      }
      markers = [];
      documents.value.forEach((doc) => {
        // console.log(doc.coords.lat);

        if (!firstPointFound) {
          firstPointFound = true;
          const center = new google.maps.LatLng(doc.coords.lat, doc.coords.lng );
          // using global variable:
          map.value.panTo(center);
        }
        const marker = new google.maps.Marker({
          position: { lat: doc.coords.lat, lng: doc.coords.lng },
          map: map.value,
        });

        marker.info = new google.maps.InfoWindow({
          content: `<div class = "MarkerPopUp" style="">
           <div class = "MarkerContext">${doc.caption}</div>
       
           </div>`,
        });

        google.maps.event.addListener(marker, "click", function () {
          marker.info.open(map.value, marker);
          geoImage.value = doc.pic;
        });
        markers.push(marker);
      });
      let cluster = new MarkerClusterer(map.value, markers, {
        maxZoom: 14,
        imagePath:
          "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
      });
    });

    const showMap = (latitude, longitude) => {
      navigator.geolocation.getCurrentPosition((position) => {
        center.lat = position.coords.latitude;
        center.lng = position.coords.longitude;
      }),
        (err) => {
          console.log(err), { timeout: 7000 };
        };
      map.value = new google.maps.Map(document.getElementById("map"), {
        center: { lat: center.lat, lng: center.lng },
        zoom: 8,
      });
    };

    onMounted(() => {
      showMap();
    });
    return { error, documents, geoImage };
  },
};
</script>

<style scoped>
.pages {
  background: #fafafa;
  padding: 3px 2px;
  width: 100%;
  height: 100%;
}
.single {
  margin: 18px 0;
}
.created-at {
  display: block;
  color: #999;
  font-size: 12px;
  margin-bottom: 4px;
}
.name {
  font-weight: bold;
  margin-right: 6px;
}
.messages {
  max-height: 800px;
  overflow: auto;
}
/* .gm-style-iw {
  width: 400px; 
  min-height: 450px;
} */
</style>