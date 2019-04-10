<template>
  <b-modal
    id="modal-authorize"
    v-model="show"
    centered
    no-close-on-backdrop
    no-close-on-esc
    content-class="rounded-lg"
    @hide="onHide"
  >
    <div class="h-100 d-flex">
      <div class="m-auto">
        <b-row class="mb-3">
          <b-col>
            <h1 class="text-white font-weight-normal text-center">
              {{ modal.title }}
            </h1>
          </b-col>
        </b-row>
        <b-row v-if="modalType === 'sign-in'">
          <b-col>
            <b-row class="my-3">
              <b-col class="text-center">
                <b-form
                  id="sign-in"
                  @submit="login"
                >
                  <b-form-group
                    label="Username"
                    label-for="username"
                    class="text-left"
                  >
                    <b-form-input
                      id="username"
                      v-model="username"
                      name="username"
                      required
                      placeholder="Username"
                      type="text"
                    />
                  </b-form-group>
                  <b-form-group
                    label="Password"
                    label-for="password"
                    class="text-left"
                  >
                    <b-form-input
                      id="password"
                      v-model="password"
                      name="password"
                      required
                      placeholder="Password"
                      type="password"
                    />
                  </b-form-group>
                  <b-form-checkbox v-model="rememberMe" class="text-left" name="remember">
                    Remember me
                  </b-form-checkbox>
                  <b-form-invalid-feedback :state="loginValid">
                    Invalid username or password
                  </b-form-invalid-feedback>
                </b-form>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="mt-5 w-100 d-flex">
                <b-button
                  size="lg"
                  variant="primary"
                  class="btn-auth"
                  style="min-width: 180px;"
                  type="submit"
                  form="sign-in"
                >
                  Login
                </b-button>
                <span class="p-2" />
                <b-button
                  size="lg"
                  variant="light"
                  class="btn-auth"
                  style="min-width: 180px;"
                  @click="goBack"
                >
                  Back
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row v-else-if="modalType === 'registration'">
          <b-col>
            <b-row class="my-3">
              <b-col class="text-center">
                <b-form
                  id="registration"
                  @submit="register"
                >
                  <b-form-group
                    label="First Name"
                    label-for="firstName"
                    class="text-left"
                  >
                    <b-form-input
                      id="firstName"
                      v-model="firstName"
                      name="firstName"
                      required
                      placeholder="First Name"
                      type="text"
                    />
                  </b-form-group>
                  <b-form-group
                    label="Last Name"
                    label-for="lastName"
                    class="text-left"
                  >
                    <b-form-input
                      id="lastName"
                      v-model="lastName"
                      name="lastName"
                      required
                      placeholder="Last Name"
                      type="text"
                    />
                  </b-form-group>
                  <b-form-group
                    label="Username"
                    label-for="username"
                    class="text-left"
                  >
                    <b-form-input
                      id="username"
                      v-model="username"
                      name="username"
                      required
                      placeholder="Username"
                      type="text"
                    />
                  </b-form-group>
                  <b-form-group
                    label="Email"
                    label-for="email"
                    class="text-left"
                  >
                    <b-form-input
                      id="email"
                      v-model="email"
                      name="email"
                      required
                      placeholder="Email"
                      type="email"
                    />
                  </b-form-group>
                  <b-form-group
                    label="Password"
                    label-for="password"
                    class="text-left"
                  >
                    <b-form-input
                      id="password"
                      v-model="password"
                      name="password"
                      required
                      placeholder="Password"
                      type="password"
                    />
                  </b-form-group>
                </b-form>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="mt-5 w-100 d-flex">
                <b-button
                  size="lg"
                  variant="primary"
                  class="btn-auth"
                  style="min-width: 180px;"
                  type="submit"
                  form="registration"
                >
                  Register
                </b-button>
                <span class="p-2" />
                <b-button
                  size="lg"
                  variant="light"
                  class="btn-auth"
                  style="min-width: 180px;"
                  @click="goBack"
                >
                  Back
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row v-else-if="modalType === 'confirm'">
          <b-col>
            <b-row class="my-3 mb-3">
              <b-col class="text-center">
                <h5>
                  Please close this window or click continue to sign in with your new account.
                </h5>
              </b-col>
            </b-row>
            <b-row class="my3">
              <b-col class="text-center">
                <b-button
                  size="lg"
                  variant="primary"
                  class="btn-auth"
                  style="max-width: 250px;"
                  @click="goTo('sign-in')"
                >
                  Continue
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row v-else>
          <b-col>
            <b-row class="my-3">
              <b-col class="text-center">
                <b-button
                  size="lg"
                  variant="outline-secondary"
                  class="btn-auth"
                  @click="goTo('registration')"
                >
                  Create new account
                </b-button>
              </b-col>
            </b-row>
            <b-row class="my3">
              <b-col class="text-center">
                <b-button
                  size="lg"
                  variant="outline-secondary"
                  class="btn-auth"
                  @click="goTo('sign-in')"
                >
                  Sign in
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
    </div>

    <template slot="modal-footer">
      <div style="display: none;" />
    </template>
  </b-modal>
</template>

<script>
  import { ipcRenderer } from 'electron';
  import {AUTHORIZED} from "../../dispatch-types";

  const modalTypes = ['select', 'sign-in', 'confirm', 'registration'];

  const modals = {
    select: {
      title: 'VoxPop',
    },
    registration: {
      title: 'Create an account',
    },
    confirm: {
      title: 'New account created successfully',
    },
    'sign-in': {
      title: 'Sign in',
    },
  };

  export default {
    name: 'AuthModal',
    data() {
      return {
        noRedirect: false,
        username: null,
        password: null,
        email: null,
        firstName: null,
        lastName: null,
        rememberMe: false,
        loginValid: true
      };
    },
    computed: {
      modal: {
        get() {
          return modals[this.modalType];
        },
      },
      modalType: {
        get() {
          if (!modalTypes.includes(this.$route.query.auth)) {
            return 'select';
          }
          return this.$route.query.auth;
        },
      },
      show: {
        get() {
          return this.$authModal.showModal;
        },
        set(value) {
          this.$authModal.showModal = value;
        }
      }
    },
    mounted() {
      this.$root.$on('unauthorized', this.showModal);
    },
    methods: {
      onHide() {
        this.$authModal.showModal = false;
      },
      showModal(params) {
        this.noRedirect = params && !!params.noRedirect;

        this.$authModal.showModal = true;
      },
      // modalChangeState() {
      //   // if (!localStorage.auth && this.$route.query.auth) {
      //     this.$emit('auth:modal:change:state');
      //   // }
      // },
      goTo(modal = 'login') {
        if (typeof modal === 'object') {
          return;
        }

        this.$router.push({query: Object.assign({}, this.$route.query, {auth: modal}, this.noRedirect ? {'no-redirect': true} : {})});
      },
      goBack() {
        this.$router.replace({query: Object.assign({}, this.$route.query, {auth: 'select'}, this.noRedirect ? {'no-redirect': true} : {})});
      },
      login(evt) {
        evt.preventDefault();

        this.loginValid = true;

        this.$auth.login({
          params: { // Vue-resource
            username: this.username,
            password: this.password
          },
          data: { // Axios
            username: this.username,
            password: this.password
          },
          rememberMe: this.rememberMe,
          redirect: false,
          fetchUser: true,
          success: function () {
            this.$authModal.showModal = false;

            console.log('Authorized');

            this.$root.$emit('authorized');
            ipcRenderer.send(AUTHORIZED);

            if (!this.$route.query['no-redirect']) {
              this.$router.push(this.$route.query.redirect || {name: 'profile'});
            }
          },
          error: function (err) {
            let res = err.response;

            if (res.status === 404) {
              this.loginValid = false;
            }
          }
        });

        // localStorage.auth = 1;
      },
      register(evt) {
        evt.preventDefault();

        let that = this;

        this.$auth.register({
          // url: '/auth',
          // method: 'post',
          params: { // Vue-resource
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            username: this.username,
            password: this.password
          },
          data: { // Axios
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            username: this.username,
            password: this.password
          },
          redirect: false,
          success: function () {
            that.$authModal.showModal = false;

            console.log('Registered');

            this.goTo('confirm');
          },
          error: function (err) {
            let res = err.response;

            if (res.status === 404) {
              console.log('Incorrect username or password');
            }
            console.log(err.response);
          }
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "../../assets/scss/main";

  $close-size: 2em;

  /deep/ .modal-dialog {
    min-width: 650px;

    .modal-content {
      .btn-auth {
        border-radius: 30px;
        padding-left: 2em;
        padding-right: 2em;
        width: 100%;
        font-size: 1.5em;
        min-height: 2em;
      }

      .modal-header {
        border: 0;

        .close {
          color: white;
          font-size: $close-size;
          width: $close-size;
          font-weight: normal;
        }
      }

      .modal-footer {
        border: 0;
      }

      .modal-body {
        padding-bottom: 50px;
        padding-top: 50px;
      }

      min-height: 300px;
      background-color: $primary-states;
    }
  }
</style>
