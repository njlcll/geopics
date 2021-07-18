<template>
  <div class="container-fluid">
    <h4 class=" d-flex justify-content-center mt-4">Current Projects</h4>

    <div
      class="list-group"
      v-for="doc in formattedDocuments"
      :key="doc.name"
      @click="setActive"
    >
      <button
        class="list-group-item list-group-item-action"
        :class="{
          active: active(doc.name),
        }"
        :data-li="doc.name"
      >
        {{ doc.name }}
        <span v-if="active(doc.name)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-heart-fill"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
            /></svg
        ></span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
export default {
  setup() {
    let currentActive = "p2";
    let clicked = 0;
    
    let documents = ref([
      {
        name: "p1",
      },
      {
        name: "demo",
      },
      {
        name: "p3",
      },
    ]);

    const active = (name) => {
      return name == currentActive;
    };
    const setActive = (e) => {
       
      currentActive = e.target.getAttribute("data-li");
      localStorage.setItem("group", currentActive);
      documents.value[0].clicked = clicked++;
    };
    const formattedDocuments = computed(() => {
      if (documents.value) {
        return documents.value.map((doc) => {
          return { ...doc, count: clicked };
        });
      }
    });
    onMounted(() => {
      let group = localStorage.getItem("group");
      if (!group) {
        group = "demo";
        localStorage.setItem("group", group);
      }
      currentActive = group;
      //force refresh of formattedDocuments
      documents.value[0].clicked = clicked++;
    });
    return { formattedDocuments, setActive, active };
  },
};
</script>

<style>
</style>