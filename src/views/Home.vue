<template>
  <div class=" big-max">
    <div class="row">
      <div class="column col-12 text-center">
        <div class="home col-12 " v-if="user">
          <Navbar />

          <Group></Group>

          <div class="fs-5 text border border-dark rounded-2 p-3 mt-2 big-max">
            <!-- <p>Hey there {{ user.displayName }}</p> -->
            <p class="email">Logged in as {{ user.email }}</p>

            <button class="btn btn-primary" @click="handleClick">Logout</button>
          </div>
        </div>
        <div v-else col-12 >
          <div class="text-center mt-3 p-4">
            <button class="btn btn-primary" @click="loginClick">Login</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import { projectAuth } from "../firebase/config";
import useLogout from "../composables/useLogout";
import getUser from "../composables/getUser";
import Navbar from "../components/Navbar.vue";
import Group from "../components/Group.vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
export default {
  components: { Navbar, Group },
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
      // navigator.mediaDevices
      //   .getUserMedia({
      //      video: {
      //       facingMode: { ideal: "environment" },
      //       width: { ideal: 4096 },
      //       height: { ideal: 2160 },
      //     },
      //   })
      //   .then((stream) => {
      //     console.log("camera ok");
      //   })
    });

    return { handleClick, user, loginClick };
  },
};
</script>

<style>
.userscreen{

}
</style>




