<template>
  <div></div>
</template>

<script>
import { ACTION_LOGOUT } from "../store/modules/auth";

export default {
  name: "Logout",
  created() {
    this.$store.dispatchPromise(ACTION_LOGOUT).then(() => {
      this.$router.push({ name: "home" });
    });
  }
};
</script>

<style scoped></style>
