<template>
  <b-row class="logo mt-4 mb-4">
    <b-col class="text-center">
      <router-link :to="{ name: 'home' }" title="VoxPop">
        <div class="logoHolder">
          <img class="logo-normal" alt="VoxPop" src="../../assets/icons/voxpopNewLogo.png" />
          <img class="logo-icon" alt="VoxPop" src="../../assets/icons/voxpopNewLogo.png" />
        </div>
      </router-link>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "Logo"
};
</script>

<style scoped lang="scss">
.logo {
  .logo-icon {
    display: none;
  }
}

.logoHolder {
  height: 100px;
  width: 230px;
}

.logo-normal {
  width: 100%;
  height: auto;
}

.vsm-collapsed {
  .logo {
    .logo-icon {
      display: inline-block;
      width: 100%;
      height: auto;
    }

    .logoHolder {
      height: 100px;
      width: 50px;
    }

    .logo-normal {
      display: none;
    }
  }
}
</style>
