<template>
  <div class="">
    <Navbar />
    <NewChatForm />
    <ChatWIndow />
   
  </div>
</template>

<script>
import NewChatForm from '../components/NewChatForm.vue'
import ChatWIndow from '../components/ChatWIndow.vue'
import Navbar from '../components/Navbar.vue'
import getUser from '../composables/getUser'
import { watch } from 'vue'
import { useRouter } from 'vue-router'
export default {
  components: { Navbar, NewChatForm , ChatWIndow},
  setup() {
    const router = useRouter()
    const { user } = getUser()
    // if the user value is ever null, redirect to welcome screen
    watch(user, () => {
      if (!user.value) {
        router.push({ name: 'Welcome' })
      }
    })
  }
}
</script>

<style>
</style>