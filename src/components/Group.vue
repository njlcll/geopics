<template>
  <div id="group" class="container-fluid">
    <h4 class="d-flex justify-content-center mt-4">Current Projects</h4>

    <div
      class="list-group"
      v-for="doc in formattedDocuments"
      :key="doc.id"
      @click="setActive"
    >
      <button
        class="list-group-item list-group-item-action"
        :class="{
          active: active(doc.project),
        }"
        :data-li="doc.project"
      >
        {{ doc.project }}
        <span v-if="active(doc.project)">
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
    <div class="form mt-3">
      <div class="mt-3">
        <label for="group" class="form-label">Add Group</label>
        <input
          type="text"
          class="form-control"
          id="group"
          v-model="newProject"
        />
        <button type="button" class="btn btn-primary mt-3" @click="addGroup">
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onBeforeMount } from "vue";
import getCollection from "../composables/getCollection";
import useCollection from "../composables/useCollection";
import { timestamp } from "../firebase/config";
import {setproject, getProject } from "../composables/localStorage"
export default {
  setup() {
    let currentActive = "Demo";
    let clicked = 0;
    const newProject = ref("");

    const { error, documents } = getCollection("geoprojects")
    const { addError, addDoc } = useCollection("geoprojects")

    const addGroup = async () => {
      const filtered = documents.value.filter((doc) => {
        console.log(doc.project.toUpperCase(), newProject.value.toUpperCase());
        return doc.project.toUpperCase() == newProject.value.toUpperCase();
      });

      if (filtered.length === 0 && newProject.value.trim() != "") {
        console.log("add", newProject.value.trim());
        let data = {       
          project: newProject.value.trim(),
          created_at: timestamp,
        }
        await addDoc(data)

      } else {
        console.log("bad project name ", newProject.value);
      }
    };

    const onSetup = () => {
      const group = getProject()
      currentActive = group;
      console.log(group);
      //force refresh of formattedDocuments
      //documents.value[0].clicked = clicked++;
    };

    onSetup();

    
    const active = (name) => {
      return name == currentActive;
    };

    const setActive = (e) => {
      currentActive = e.target.getAttribute("data-li");
      setproject(currentActive)
      documents.value[0].clicked = clicked++;
    };

    const formattedDocuments = computed(() => {
      console.log("in format");
      if (documents.value) {
        return documents.value.map((doc) => {
          return { ...doc, count: clicked };
        });
      }
    });

    return {
      formattedDocuments,
      setActive,
      active,
      documents,
      addGroup,
      newProject,
    };
  },
};
</script>

<style>
#group {
  max-width: 600px;
}
#group .form {
}
</style>