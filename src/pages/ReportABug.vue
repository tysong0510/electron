<template>
  <b-container fluid>
    <b-row>
      <b-button variant="primary" size="lg" href="mailto:support@voxpopgames.com">Press to report a bug</b-button>
    </b-row>

    <b-row class="text-align text-white p-4">
      <p>Thank you for your feedback and continued support of the VoxPop Games Platform</p>
    </b-row>
    <b-row>
      <div class="photoContainer">
        <img
          src="https://voxpop-image-bucket.s3.us-east-2.amazonaws.com/VoxPopGamesEmailPhotos/vaporwave-wallpaper-1280x800.jpg"
          alt="vaporwavephoto"
          height="auto"
          width="700px"
        />
      </div>
    </b-row>
    <p class="text-white p-3">Please Include the Client Version Number (found below) for any issues you have encountered</p>

    <div>
      <p v-if="!isLive">TEST ENV</p>
      <p class="text-right pt-4">Dev 1.1.9</p>
    </div>
  </b-container>
</template>

<script>
import { baseURL } from "../apiConfig";

export default {
  computed: {
    isLive() {
      var isLive = false;
      if (baseURL === "https://www.voxpopgames.site/") {
        isLive = true;
      }
      console.log("Is this live: ", isLive);
      return isLive;
    }
  }
};
</script>

<style>
.btn {
  margin-left: auto;
  margin-right: auto;
}
</style>
