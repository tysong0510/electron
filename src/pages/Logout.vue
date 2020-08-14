<template>
  <div></div>
</template>

<script>
import { ACTION_LOGOUT } from "../store/modules/auth";
// import regedit from "regedit";
// regedit.setExternalVBSLocation("resources/regedit/vbs");

import fs from "fs";
import path from "path";
import { remote } from "electron";
const USER_DATA_PATH = remote.app.getPath("userData");

export default {
  name: "Logout",
  created() {
    // if (process.platform == "win32") {
    //   this.$store.state.auth.userCredentials = {};

    //   regedit.deleteKey(["HKCU\\SOFTWARE\\VoxPop Games\\Credentials"], (err, data) => {
    //     if (err) {
    //       console.log("There was an error deleting key: HKCU\\SOFTWARE\\VoxPop Games\\Credentials ", err);
    //     } else {
    //       console.log("Successful deletion of key: HKCU\\SOFTWARE\\VoxPop Games\\Credentials ", data);
    //     }
    //   });
    // }

    const credentialsPath = path.join(USER_DATA_PATH, "credentials.txt");

    fs.unlink(credentialsPath, err => {
      if (err) {
        console.log("There was an issue removing the path: ", credentialsPath);
      } else {
        console.log(credentialsPath, "has been removed successfully");
      }
    });

    this.$store.dispatch("clearCart");

    this.$store.dispatchPromise(ACTION_LOGOUT).then(() => {
      this.$router.push({ name: "home" });
    });
  }
};
</script>

<style scoped></style>
