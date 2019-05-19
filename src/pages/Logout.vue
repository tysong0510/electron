<template>
  <div></div>
</template>

<script>
import { ACTION_LOGOUT } from "../store/modules/auth";

export default {
  name: "Logout",
  created() {
    this.$store.dispatch(ACTION_LOGOUT);
    this.$router.push({ name: "home" });
  }
};
</script>

<style scoped></style>
