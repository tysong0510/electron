<template>
  <div>
    <b-row class="mt-1 mb-4 pb-2">
      <b-col>
        <router-link :to="{ name: 'userDirectory' }">
          <div
            class="d-inline-block"
            style="border-left: 1px solid; border-bottom: 1px solid; border-radius: 1px; height: .6em; width: .6em; transform: matrix(1, 1, -1, 1, 0, 0);"
          />
          Back to User Directory
        </router-link>
      </b-col>
    </b-row>

    <b-card no-body class="flex-row pb-3 mb-2 border-0">
      <b-card-img :src="user.images.main" class="img-profile pulse" />
      <b-card-body class="pr-0">
        <b-row no-gutters>
          <b-col class="col-auto mr-auto">
            <h2 class="card-title display-2 text-white" style="font-size: 2.25rem;">
              {{ user.username }}
              <span v-if="user.role === 'admin'" class="voxLogoHolder">
                <img src="../assets/icons/Emblem_Mod.png" alt="AdminLogo" class="voxlogo d-inline-block m-auto" />
                <!-- Put the voxpop logo svg here for now then we can ask Marc later wha image he'd like -->
              </span>
              <span v-if="user.role === 'staff'" class="voxLogoHolder">
                <img src="../assets/icons/Emblem_Staff.png" alt="StaffLogo" class="voxlogo d-inline-block m-auto" />
                <!-- Put the voxpop logo svg here for now then we can ask Marc later wha image he'd like -->
              </span>
              <span v-if="user.role === 'Developer'" class="voxLogoHolder">
                <img src="../assets/icons/Emblem_Dev2.png" alt="DeveloperLogo" class="voxlogo d-inline-block m-auto" />
                <!-- Put the voxpop logo svg here for now then we can ask Marc later wha image he'd like -->
              </span>
              <span v-if="user.role === 'Streamer'" class="voxLogoHolder">
                <img src="../assets/icons/Emblem_Streamer.png" alt="StreamerLogo" class="voxlogo d-inline-block m-auto" />
                <!-- Put the voxpop logo svg here for now then we can ask Marc later wha image he'd like -->
              </span>
              <span v-if="user.role === 'Content-Creator'" class="voxLogoHolder">
                <img src="../assets/icons/contentcreator_badge.png" alt="ContentCreatorBadge" class="voxlogo d-inline-block m-auto" />
                <!-- Put the voxpop logo svg here for now then we can ask Marc later wha image he'd like -->
              </span>
              <span v-if="user.role === 'Gamer'" class="voxLogoHolder">
                <img src="../assets/icons/gamer_badge.png" alt="GamerBadge" class="voxlogo d-inline-block m-auto" />
                <!-- Put the voxpop logo svg here for now then we can ask Marc later wha image he'd like -->
              </span>
            </h2>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

    <b-row class="pb-5 mb-5">
      <b-col class="col-8 mr-auto text-white">
        <b-row no-gutters>
          <b-col class="col-4 d-inline mr-auto">
            <d3-pie
              :data="[
                { key: 'test', value: 20 },
                { key: 'test1', value: 50 },
                { key: 'test2', value: 30 }
              ]"
              style="width: auto; height: 184.02px;"
            />
          </b-col>
          <b-col class="col-8 d-inline text-white">
            <img src="../assets/icons/info_square2.png" alt="infoSquare" />
          </b-col>
        </b-row>
      </b-col>
      <b-col class="col-4 d-inline text-white border-left">
        <h4 class="display-4 d-inline" style="font-size: 1.5rem;">
          Friends
        </h4>
        <img class="mt-5" src="../assets/icons/firends_block.png" alt="friendsBlock" />
      </b-col>
    </b-row>
    <!-- Developer button -->
    <b-row v-if="loggedInUserRole == 'admin' && user.role != 'Developer'">
      <b-button variant="primary" @click="showModal()">
        Developer / Publisher
      </b-button>
    </b-row>
    <b-modal id="roleModal" ref="roleModal" class="roleModal" centered hide-footer title="Assign Developer / Publisher">
      <b-row class="my-3 mb-3">
        <b-col class="text-center">
          <h5 class="font-weight-normal">
            Set <span class="font-italic border-bottom text-primary">{{ user.username }}</span> to Developer / Publisher?
          </h5>
        </b-col>
      </b-row>
      <b-row class="m-4">
        <!--<b-col>
          <b-form-checkbox v-model="developer" name="developer">
            Developer
          </b-form-checkbox> 
        </b-col>
        <b-col>
          <b-form-checkbox v-model="publisher" name="publisher">
            Publisher
          </b-form-checkbox>
        </b-col> -->
        <b-col>
          <b-form-radio v-model="account" name="developer" value="developer">Developer</b-form-radio>
        </b-col>
        <b-col>
          <b-form-radio v-model="account" name="publisher" value="publisher">Publisher</b-form-radio>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <label>Developer / Publisher Name: </label>
          <b-form-input id="publisher" v-model="accountName" name="publisher" required type="text" />
        </b-col>
      </b-row>
      <b-row class="my-3">
        <b-col class="text-center">
          <b-button :disabled="loading" size="lg" variant="primary" class="btn-auth" style="max-width: 250px;" @click="addDeveloper()">
            <span v-if="!loading">Submit</span>
            <b-spinner v-else></b-spinner>
          </b-button>
        </b-col>
      </b-row>

      <b-row v-if="submissionError">
        <b-col>
          <span style="color: red;">{{ submissionErrorMessage }}</span>
        </b-col>
      </b-row>
    </b-modal>

    <b-modal
      id="successModal"
      ref="successModal"
      class="successModal"
      centered
      hide-footer
      title="Developer / Publisher Assigning completed"
    >
      <b-row class="my-3 mb-3">
        <b-col class="text-center">
          <h5 class="font-weight-normal">
            <span class="font-italic border-bottom text-primary">{{ user.username }}</span> has been assigned role Developer / Publisher
          </h5>
        </b-col>
      </b-row>

      <b-row class="my-3">
        <b-col class="text-center">
          <b-button size="lg" variant="primary" class="btn-auth" style="max-width: 250px;" @click="hideSuccessModal()">
            Close
          </b-button>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>
<script>
import Axios from "axios";

export default {
  name: "UserDirectoryProfile",
  data() {
    return {
      developer: false,
      publisher: false,
      account: null,
      accountName: null,
      developerOrPublisherName: null,
      submissionError: false,
      submissionErrorMessage: null,
      loading: false
    };
  },
  computed: {
    user() {
      return this.$route.params.user;
    },
    loggedInUserRole() {
      return this.$store.state.auth.user.role;
    }
  },
  created() {
    console.log("user logged in now: ", this.$store.state.auth.user.role);
  },
  methods: {
    addDeveloper() {
      this.loading = true;
      console.log("Turns this user into a developer");
      console.log("this user is: ", this.user);
      // console.log("is developer pressed: ", this.developer);
      // console.log("is publisher pressed: ", this.publisher);
      console.log("account that was picked is: ", this.account);
      console.log("account name: ", this.accountName);

      if (this.account == null) {
        this.submissionError = true;
        this.submissionErrorMessage = "Pick either Developer or Publisher";
      } else {
        let developerParams = {
          username: this.user.username,
          accountName: this.accountName,
          account: this.account
        };

        Axios({ url: "/users/setDeveloper", params: developerParams, method: "POST" })
          .then(async resp => {
            console.log("successful response: ", resp);
            this.hideModal();
            this.loading = false;
            this.showSuccessModal();
          })
          .catch(err => {
            console.log("error with processing request for setDeveloper: ", err);
            this.submissionError = true;
            this.submissionErrorMessage = err;
            this.loading = false;
          });
      }
    },
    showModal() {
      this.$refs["roleModal"].show();
    },
    hideModal() {
      this.$refs["roleModal"].hide();
    },
    showSuccessModal() {
      this.$refs["successModal"].show();
    },
    hideSuccessModal() {
      this.$refs["successModal"].hide();
    }
  }
};
</script>
<style scoped lang="scss">
@import "../assets/scss/partials/store";

.update-button {
  &:before {
    content: "\21BB";
  }
}

/deep/ .statistic-table > tbody > [role="row"]:not(.b-table-details) {
  cursor: pointer;
}

.card-body .card-text .text-recently-played {
  font-size: 0.3em !important;
}

.horizontal-view {
  .horizontal-view-items {
    .item {
      transition: ease-in-out 0.25s;

      &:hover {
        background-color: $block-hover-background-color;
      }
    }

    .game-image {
      max-height: 150px;
      min-height: 150px;

      img {
        max-height: 140px;
      }
    }
  }
}

.d-inline.float-right {
  font-size: 1.75rem;
}

.img-profile,
.card-img-left {
  //background: url("../assets/icons/noAvatarPlaceholder.jpg");
  //background: transparent;
  background-size: 100% 100%;
  height: 140px;
  width: 140px;
  border-radius: 50%;
  /*   margin: 10px auto; */
}

/*tr:focus {
    outline: 0;
  }
  tr:hover {
    cursor: pointer;
  }*/

.pulse {
  box-shadow: 0 0 0 0 #696e80;
  animation: pulse 1.5s 1 cubic-bezier(0.66, 0, 0, 1);
}

.voxcoin {
  width: 20px;
  height: 20px;
  position: relative;
  top: -2px;
}

.voxlogo {
  width: 30px;
  height: 30px;
  bottom: 3px;
  position: relative;
}

.voxlogoHolder {
  padding-bottom: 10px;
}

@keyframes pulse {
  to {
    box-shadow: 0 0 0 45px rgba(232, 76, 61, 0);
  }
}
</style>
