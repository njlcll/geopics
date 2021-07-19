<template>
  <div class="p">
    <Navbar />

    <div class="">
      <div class="constrain-more">
        <div class="map">
          <div id="map" ref="map"></div>
        </div>
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
import { computed, watch, onMounted, ref } from "vue";
import { formatDistanceToNow } from "date-fns";
import Navbar from "../components/Navbar";
export default {
  components: { Navbar },
  setup() {
    const { error, documents } = getCollection("geopics");
    let geoImage = ref("");
    let center = { lat: 57.948786899999995, lng: -5.1613893 };
    let map = ref(null);

    watch(
      () => documents.value,
      (count, prevCount) => {
        documents.value.forEach((doc) => {
         // console.log(doc.coords.lat);

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
            marker.info.open(map, marker);
            geoImage.value = doc.pic;
          });
        });
      }
    );

    const showMap = (latitude, longitude) => {
      navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position.coords.latitude, position.coords.longitude);
        center.lat = position.coords.latitude;
        center.lng = position.coords.longitude;

        map.value = new google.maps.Map(document.getElementById("map"), {
          center: { lat: center.lat, lng: center.lng },
          zoom: 8,
        });
        // marker = new google.maps.Marker({
        //   position: { lat: center.lat, lng: center.lng },
        //   map: map.value,
        // });
        //        getPoints();
        // context.emit("coords", { lat: center.lat, lng: center.lng });
        // google.maps.event.addListener(map.value, "click", mapClick);
      }),
        (err) => {
          console.log(err), { timeout: 7000 };
        };
    };
    // auto-scroll to bottom of messages
    const messages = ref(null);
    // onUpdated(() => {
    //   messages.value.scrollTop = messages.value.scrollHeight;
    // }),
    onMounted(() => {
      showMap();
    });
    return { error, documents, messages, geoImage };
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