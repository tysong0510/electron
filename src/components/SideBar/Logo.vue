<template>
  <b-row class="logo mt-4 mb-4">
    <b-col class="text-center">
      <router-link
        :to="{name: 'home'}"
        title="VoxPop"
      >
        <img
          class="logo-normal"
          alt="VoxPop"
          src="../../assets/logo.svg"
        >
        <img
          class="logo-icon"
          alt="VoxPop"
          src="../../assets/icons/voxpop.svg"
        >
      </router-link>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'Logo',
};
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
