<template>
  <div class="constrain-more">
   
    <div class="map">
      <div id="map" ref="map"></div >
    </div>
  </div>
</template>

<script>
import { onMounted,computed } from "@vue/runtime-core";
import { ref } from "vue";
import getCollection from "../composables/getCollection";
import { projectFirestore } from "../firebase/config";
export default {
  setup(props, context) {
     const { error, docs } = getCollection("messages");

    const documents = ref([]);

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
      context.emit("coords", { lat: center.lat, lng: center.lng });
    };

    // watch(documents.value, (d1, dw) => {
    //   console.log("d1", d1.value)

    // });
   
    // a
    const getPoints = () => {
      projectFirestore
        .collection("geopics")
        .orderBy("created_at", "desc")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
           // console.log(doc.id, " => ", doc.data());
            //documents.value.push({ ...doc.data(), id: doc.id });
            const x = doc.data().coords.lat;
            const y = doc.data().coords.lng;
            var icon = {
              path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
              fillColor: "#FF0000",
              fillOpacity: 0.6,
              anchor: new google.maps.Point(0, 0),
              strokeWeight: 0,
              scale: 0.5,
            };
            new google.maps.Marker({
              position: { lat: x, lng: y },
              map: map.value,
              icon,
            });
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        })
    }
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
        getPoints();
        context.emit("coords", { lat: center.lat, lng: center.lng });
        google.maps.event.addListener(map.value, "click", mapClick);
      }),
        (err) => {
          console.log(err), { timeout: 7000 };
        };
    }

    onMounted(() => {
      showMap();
    })

    return { map, documents };
  },
};
</script>

<style scoped>

</style>