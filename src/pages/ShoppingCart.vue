<template>
  <div>
    <h1 class="text-white text-center">Shopping Cart</h1>

    <span v-if="isEmpty" class="text-white text-center">Shopping Cart is Empty...</span>
    <div v-else>
      <b-row>
        <b-col>
          <b-row>
            <b-col>
              <h4>Product</h4>
            </b-col>
            <b-col>
              <h4>Price</h4>
            </b-col>
          </b-row>
          <!-- Put repteating list here...-->

          <b-row v-for="obj in this.$store.state.recoUserAndGame" :key="obj.game.id" class="pt-2 pb-5 mb-5 border-bottom">
            <b-img :src="obj.game.images.main" class="align-self-start m-1" height="75px" width="125" />

            <b-col>
              <b-row>
                <p>{{ obj.game.developer }}</p>
              </b-row>
              <b-row v-if="obj.user != null">
                <p>Recommended by {{ obj.user.username }}: {{ obj.user.id }}</p>
              </b-row>
            </b-col>

            <b-col class=" text-center ">
              {{ obj.game.price | currency("USD") }}
            </b-col>

            <b-col>
              <b-icon-x-circle-fill
                id="remove"
                variant="danger"
                class="float-right"
                @click="removeFromCart(obj.game)"
              ></b-icon-x-circle-fill>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <p class="text-white text-center">Estimated Total: {{ totalPrice | currency("USD") }}</p>

      <b-row>
        <b-col class="w-100 d-flex">
          <b-button
            size="lg"
            variant="primary"
            class="btn-auth"
            style="min-width: 180px; margin: 0 auto;"
            type="submit"
            :disabled="loading"
            @click="checkout"
          >
            <span v-if="!loading" style="max-width: 1em; max-height: 1em;">Checkout</span>
            <b-spinner v-else></b-spinner>
          </b-button>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import currency from "../mixins/currency";
const { ipcRenderer } = require("electron");
export default {
  name: "ShoppingCart",
  mixins: [currency],
  data() {
    return {
      loading: false,
      total: 0.0,
      recommenderID: null
    };
  },

  computed: {
    isEmpty() {
      if (this.$store.state.cart.length < 1) {
        return true;
      }
      return false;
    },

    totalPrice: function() {
      //console.log(updatedPrice);
      var totalPrice = 0.0;
      var shoppingCart = this.$store.state.cart;
      for (var i = 0; i < shoppingCart.length; i++) {
        totalPrice += shoppingCart[i].price;
      }
      return totalPrice;
    },
    recommendedUsers() {
      console.log("RecoUserAndGame: ", this.$store.state.recoUserAndGame);
      return this.$store.state.recoUserAndGame;
    }
  },

  methods: {
    removeFromCart(game) {
      console.log("remove from cart selected");

      var shoppingCart = this.$store.state.cart;
      var index = 0;

      for (var i = 0; i < shoppingCart.length; i++) {
        if (shoppingCart[i].id == game.id) {
          index = i;
          //send this index to removeRecommendedUserIdIndex
        }
      }

      console.log("index of: ", game.title, " to be removed is: ", index);

      this.$store.dispatch("removeFromCart", index);

      this.$store.dispatch("removeUserRecommendedIdIndex", index);
      this.$store.dispatch("removeRecoUserAndGame", index);

      console.log("list of recommended userId's after removal: ", this.$store.state.recommendedUserId);
      console.log("shopping cart: ", this.$store.state.cart);
      console.log("recoUserAndGame: ", this.$store.state.recoUserAndGame);
      //console.log("list of user recommendedId indexes after removing from cart: " + this.$store.state.recommendedUserIdIndex);
    },

    checkout() {
      this.loading = true;
      console.log("made it to checkout function...");
      console.log("total price you are paying is: ", this.totalPrice);

      // var recommenderIds = this.$store.state.recommendedUserId.filter(function(el) {
      //   return el != null;
      // });

      // console.log("list of recommendedrIDs in checkout: ", recommenderIds);

      var shoppingCart = this.$store.state.cart;
      console.log("shoppingCart: ", shoppingCart);
      var gameIDs = [];

      for (var j = 0; j < shoppingCart.length; j++) {
        gameIDs.push(shoppingCart[j].id);
      }

      var userRecommendedIDs = this.$store.state.recommendedUserIdIndex;
      // var hasRecommendations = 0;

      // for (var i = 0; i < userRecommendedIDs.length; i++) {
      //   if (userRecommendedIDs[i] > 0) {
      //     hasRecommendations++;
      //   }
      // }
      // console.log("value of hasRecommendations: ", hasRecommendations);

      // if (hasRecommendations == 0) {
      //   console.log("there are no recos...");
      //   userRecommendedIDs = null;
      // }

      // console.log("userRecommendedIDs before: ", userRecommendedIDs);

      // if (userRecommendedIDs != null) {
      //   for (var k = 0; k < userRecommendedIDs.length; k++) {
      //     if (userRecommendedIDs[k] == null) {
      //       userRecommendedIDs[k] = 0;
      //     }
      //   }
      // }

      console.log("userRecommendedIDs after: ", userRecommendedIDs);

      //this.$store.dispatch("clearCart");

      console.log("here are all the id's for checkout: ", gameIDs);
      try {
        //Need to pass an array/list of game objects to backend
        ipcRenderer.send("open-new-window", gameIDs, this.totalPrice, userRecommendedIDs);
        this.$store.dispatch("clearCart");
        this.$store.dispatch("clearRecoUserAndGame");
        this.$store.dispatch("clearUserRecommendedIdIndex");
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    }
  }
};
</script>
<style>
#remove {
  cursor: pointer;
  height: 25px;
  width: 25px;
}
</style>
