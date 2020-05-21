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
          <b-row v-for="game in this.$store.state.cart" :key="game.id" class="pt-2 pb-5 mb-5 border-bottom">
            <b-img :src="game.images.main" class="align-self-start m-1" height="75px" width="125" />
            <p>{{ game.developer }}</p>

            <b-col class=" text-center ">
              {{ game.price | currency("USD") }}
            </b-col>

            <b-col>
              <b-icon-x-circle-fill id="remove" variant="danger" class="float-right" @click="removeFromCart(game)"></b-icon-x-circle-fill>
            </b-col>
          </b-row>
        </b-col>

        <!--
        <b-col>
          <h4>Price</h4>
          <b-row v-for="game in this.$store.state.cart" :key="game.id" class="pt-4 pb-5 mb-5 ">
           {{ game.price | currency("USD")}}
          </b-row>
        </b-col>
        -->
        <!--
        <b-col>
          <h4>Description</h4>
          <b-row>
            <ul id="cartUL" class="list-unstyled">
              <b-media v-for="game in this.$store.state.cart" :key="game.id" tag="li">
                <p>{{ game.publisher }}</p>
                <p>{{ game.developer }}</p>
              </b-media>
            </ul>
          </b-row>
        </b-col>

        <b-col>
          <h4>Price</h4>
          <b-row>
            <ul id="cartUL" class="list-unstyled">
              <b-media v-for="game in this.$store.state.cart" :key="game.id" tag="li">
                <p>{{ game.price | currency("USD") }}</p>
              </b-media>
            </ul>
          </b-row>
        </b-col> -->
      </b-row>

      <!-- <ul id="cartUL" class="list-unstyled">
        <b-media v-for="game in this.$store.state.cart" :key="game.id" tag="li" class="pt-2 pb-5 mb-5 border-bottom">
          <b-img slot="aside" :src="game.images.main" class="align-self-start" height="75px" />

          <h4>{{ game.title }}</h4>

          <p>
            {{ game.publisher }}

            <b-icon-x-circle-fill id="remove" variant="danger" class="float-right" @click="removeFromCart(game)"></b-icon-x-circle-fill>
          </p>
        </b-media>
      </ul> -->

      <p class="text-white text-left">Enter ID of user who recommended game(s):</p>
      <b-col sm="2">
        <b-form-input id="recommenderID" v-model="recommenderID" name="recommenderID" type="text" size="sm" />
      </b-col>

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
    }
  },

  methods: {
    removeFromCart(game) {
      console.log("remove from cart selected");
      this.$store.dispatch("removeFromCart", game);
      //this.totalPrice += game.price;
      this.totalPrice - game.price;
    },

    checkout() {
      this.loading = true;
      console.log("made it to checkout function...");
      console.log("total price you are paying is: ", this.totalPrice);

      var shoppingCart = this.$store.state.cart;
      console.log("shoppingCart: ", shoppingCart);
      var gameIDs = [];

      for (var j = 0; j < shoppingCart.length; j++) {
        gameIDs.push(shoppingCart[j].id);
      }

      //this.$store.dispatch("clearCart");

      console.log("here are all the id's for checkout: ", gameIDs);
      try {
        //Need to pass an array/list of game objects to backend
        ipcRenderer.send("open-new-window", gameIDs, this.totalPrice, this.recommenderID);
        this.$store.dispatch("clearCart");
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
