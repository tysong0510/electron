<template>
  <b-row class="logo mt-4 mb-4">
    <b-col class="text-center">
      <b-link href="/" title="VoxPop">
        <img class="logo-normal" alt="VoxPop" src="../../assets/logo.png">
        <img class="logo-icon" alt="VoxPop" src="../../assets/icons/voxpop.svg">
      </b-link>
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: "Logo",
  }
</script>

<style scoped lang="scss">
  .logo {
    .logo-icon {
      display: none;
    }
  }

  .vsm-collapsed {
    .logo {
      .logo-icon {
        display: inline-block;
      }
      .logo-normal {
        display: none;
      }
    }
  }
</style>
