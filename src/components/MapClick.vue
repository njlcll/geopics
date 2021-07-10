<template>
  <div class="map">
  
    <section id="map" ref="map"></section>
  </div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import { ref } from "vue";
export default {
  setup(props, context)  {
    let center = { lat: 57.948786899999995, lng: -5.1613893 };
    let map = ref(null);
    let marker;

    const mapClick = (e) => {
      center.lat = e.latLng.lat();
      center.lng = e.latLng.lng();
     
      marker.setMap(null);
      marker = new google.maps.Marker({
          position: { lat: center.lat, lng: center.lng },
          map: map.value,
        });
        context.emit('coords', { lat: center.lat, lng: center.lng })
    };

    const showMap = (latitude, longitude) => {
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

        context.emit('coords', { lat: center.lat, lng: center.lng })
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

    return {  map, addMarker };
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