<template>
  <div></div>
</template>

<script>
import { ACTION_LOGOUT } from "../store/modules/auth";
import regedit from "regedit";
regedit.setExternalVBSLocation("resources/regedit/vbs");

export default {
  name: "Logout",
  created() {
    if (process.platform == "win32") {
      this.$store.state.auth.userCredentials = {};

      regedit.deleteKey(["HKCU\\SOFTWARE\\VoxPop Games\\Credentials"], (err, data) => {
        if (err) {
          console.log("There was an error deleting key: HKCU\\SOFTWARE\\VoxPop Games\\Credentials ", err);
        } else {
          console.log("Successful deletion of key: HKCU\\SOFTWARE\\VoxPop Games\\Credentials ", data);
        }
      });
    }

    this.$store.dispatch("clearCart");

    this.$store.dispatchPromise(ACTION_LOGOUT).then(() => {
      this.$router.push({ name: "home" });
    });
  }
};
</script>

<style scoped></style>
