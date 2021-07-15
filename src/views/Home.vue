<template>
  <div class="home" v-if="user">
    <Navbar />
    <p>Hey there {{ user.displayName }}</p>
    <p class="email">Currently logged in as {{ user.email }}</p>

    <button class="btn" @click="handleClick">Logout</button>
  </div>
  <div v-else>
    <div class="text-center mt-3 p-4">
      <button class="btn" @click="loginClick">Login</button>
    </div>
  </div>
</template>

<script>
//import { projectAuth } from "../firebase/config";
import useLogout from "../composables/useLogout";
import getUser from "../composables/getUser";
import Navbar from "../components/Navbar.vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
export default {
  components: { Navbar },
  setup() {
    const router = useRouter();
    const { logout, error } = useLogout();
    const { user } = getUser();

    const handleClick = async () => {
      await logout();
    };
    const loginClick = () => {
      router.push({ name: "Login" });
    };
    onMounted(() => {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        })
        .then((stream) => {
          console.log("camera ok");
        });
    });
    return { handleClick, user, loginClick };
  },
};
</script>

<style>
</style>