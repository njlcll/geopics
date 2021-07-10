<template>
  <div class="map">
    <section id="map" ref="map"></section>
  </div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import { ref } from "vue";
export default {
  setup() {
    let center = ref({ lat: 57.948786899999995, lng: -5.1613893 });
    let map = ref(null);
    let marker;
    const mapClick = (e) => {
      center.value.lat = e.latLng.lat();
      center.value.lng = e.latLng.lng();
      console.log(e.latLng.lat(), e.latLng.lng());
      marker.setMap(null);
      marker = new google.maps.Marker({
          position: { lat: center.value.lat, lng: center.value.lng },
          map: map.value,
        });
    };
    const showMap = (latitude, longitude) => {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        center.value.lat = position.coords.latitude;
        center.value.lng = position.coords.longitude;

        map.value = new google.maps.Map(document.getElementById("map"), {
          center: { lat: center.value.lat, lng: center.value.lng },
          zoom: 8,
        });
        marker = new google.maps.Marker({
          position: { lat: center.value.lat, lng: center.value.lng },
          map: map.value,
        });

        console.log(map.value);
        google.maps.event.addListener(map.value, "click", mapClick);
      }),
        (err) => {
          console.log(err), { timeout: 7000 };
        };
    };

    const addMarker = () => {};

    onMounted(() => {
      showMap();
      //   const marker = new google.maps.Marker({
      //     position: { lat: center.lat, lng: center.lng },
      //     map: map.value,
      //   });
      // addMarker();
    });

    return { showMap, center, map, addMarker };
  },
};
</script>

<style scoped>
.map {
  position: relative;
  width: 100%;
  min-width: 100%;
  min-height: 400px;
  background-color: red;
}

#map {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}  
</style>