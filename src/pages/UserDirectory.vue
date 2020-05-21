<template>
  <div>
    <h2 class="text-center text-white">
      User Directory
    </h2>

    <b-row>
      <b-col>
        <b-row class="p-5">
          <b-col class="text-center">
            <b-form id="userDirectory" @submit.prevent="userDirectory">
              <b-form-group>
                <b-input-group>
                  <b-input-group-prepend is-text>
                    <b-icon icon="search"></b-icon>
                  </b-input-group-prepend>
                  <b-form-input id="user" ref="userDirectory" name="user" required type="text" placeholder="Search" @keyup="filterList" />
                </b-input-group>
              </b-form-group>
            </b-form>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <ul id="userUL" class="list-unstyled">
      <!--<b-media v-for="(n, index) in users" :key="index" tag="li" class=""> -->
      <b-media v-for="user of testUsers" :key="user.id" tag="li" class="pt-2 pb-5 mb-5 border-bottom">
        <b-img slot="aside" :src="getUserImage(user)" class="align-self-start" height="50px" rounded="circle" />
        <router-link :to="{ name: 'userDirectoryProfile', params: { user: user } }">
          <h5 class="display-4 mt-0 mb-1 text-white" style="font-size: 1.5rem;">
            {{ user.username }}
          </h5>
        </router-link>
      </b-media>
    </ul>
  </div>
</template>
<script>
import users from "../mixins/userDir";
//import { mapActions, mapState } from "vuex";
//import { LOAD_USERS } from "../store/actions-types";
import axios from "axios";

export default {
  name: "UserDirectory",
  mixins: users,
  data() {
    return {
      testUsers: []
    };
  },
  // computed: mapState({
  //   users: "users"
  // }),
  created() {
    //this.loadUsers();
    axios
      .get("/users")
      .then(response => {
        this.testUsers = response.data;
      })
      .catch(e => {
        console.log(e);
      });
  },

  methods: {
    //...mapActions({ loadUsers: LOAD_USERS }),

    getUserImage(user) {
      //console.log(user);
      if (user.images) {
        return user.images.main;
      }
      return " ";
    },

    filterList() {
      var ul, li, txtValue, i, input;
      input = document.getElementById("user").value;
      ul = document.getElementById("userUL");
      li = ul.getElementsByTagName("li");

      //loop through list
      for (i = 0; i < this.testUsers.length; i++) {
        txtValue = this.testUsers[i].username;
        if (txtValue.toUpperCase().includes(input.toUpperCase()) || input == "") {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
      }
    },
    userDirectory() {
      console.log("made it to userDirectory method...");
    }
  }
};
</script>
<style lang="scss">
@import "../assets/scss/main.scss";

.input-group-text {
  background-color: transparent;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
