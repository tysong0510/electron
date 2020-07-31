<template>
  <b-modal
    id="modal-authorize"
    v-model="show"
    centered
    no-close-on-backdrop
    no-close-on-esc
    content-class="rounded-lg"
    @hide="onHide"
    @shown="focusInput"
  >
    <div class="h-100 d-flex">
      <div class="m-auto">
        <b-row>
          <b-col>
            <h2 class="text-white font-weight-normal text-center">
              {{ modal.title }}
            </h2>
          </b-col>
        </b-row>
        <b-row v-if="modalType === 'sign-in'">
          <b-col>
            <b-row class="my-3">
              <b-col class="text-center">
                <b-form id="sign-in" @submit="login">
                  <b-form-group label="Username" label-for="username" class="text-left">
                    <b-form-input id="username" ref="sign-in" v-model="username" name="username" required type="text" />
                  </b-form-group>
                  <b-form-group label="Password" label-for="password" class="text-left">
                    <b-form-input id="password" v-model="password" name="password" required type="password" />
                  </b-form-group>
                  <b-row>
                    <b-col cols="6">
                      <b-form-checkbox v-model="rememberMe" class="text-left" name="remember">
                        Remember me
                      </b-form-checkbox>
                    </b-col>

                    <b-col cols="6">
                      <a href="#" class="text-right" style="color: #696E80;" @click.prevent="goTo('restore')">Forgot password</a>
                    </b-col>
                  </b-row>
                  <b-form-invalid-feedback :state="loginValid">
                    Invalid username or password
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback :state="emailValid">
                    Email address is not verified
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback :state="!otherError">
                    Error connecting to server. Please try again.
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
                  :disabled="loading"
                >
                  <span v-if="!loading" style="max-width: 1em; max-height: 1em;">Login</span>
                  <b-spinner v-else></b-spinner>
                </b-button>
                <span class="p-2" />
                <b-button size="lg" variant="light" class="btn-auth" style="min-width: 180px;" @click="goBack">
                  Back
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row v-else-if="modalType === 'registration'">
          <b-col>
            <b-row class="">
              <b-col class="text-center">
                <b-form id="registration" @submit="register">
                  <b-form-group label="First Name" label-for="firstName" class="text-left">
                    <b-form-input
                      id="firstName"
                      ref="registration"
                      v-model="firstName"
                      name="firstName"
                      required
                      type="text"
                      placeholder="E.g. Leandro"
                    />
                    <b-form-invalid-feedback :state="!validationErrors.firstName">
                      {{ validationErrors.firstName }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <b-form-group label="Last Name" label-for="lastName" class="text-left">
                    <b-form-input id="lastName" v-model="lastName" name="lastName" required type="text" placeholder="E.g. Rodriguez" />
                    <b-form-invalid-feedback :state="!validationErrors.lastName">
                      {{ validationErrors.lastName }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <b-form-group label="Username" label-for="username" class="text-left">
                    <b-form-input id="username" v-model="username" name="username" required type="text" placeholder="example123" />
                    <b-form-invalid-feedback :state="!validationErrors.username">
                      {{ validationErrors.username }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <b-form-group>
                    <div class=" text-left mt-2">
                      Selected: <strong>{{ role }} </strong>
                    </div>
                    <b-form-select v-model="role" class="mb-3" required>
                      <b-form-select-option :value="null">Pick your path</b-form-select-option>
                      <!-- <b-form-select-option value="Developer">Developer</b-form-select-option>-->
                      <b-form-select-option value="Streamer">Streamer</b-form-select-option>
                      <b-form-select-option value="Content-Creator">Content Creator</b-form-select-option>
                      <b-form-select-option value="Gamer">Gamer</b-form-select-option>
                    </b-form-select>
                  </b-form-group>
                  <b-form-group label="Email" label-for="email" class="text-left">
                    <b-form-input id="email" v-model="email" name="email" required placeholder="example@example.com" type="email" />
                    <b-form-invalid-feedback :state="!validationErrors.email">
                      {{ validationErrors.email }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <b-form-group label="Password" label-for="password" class="text-left">
                    <b-form-input id="password" v-model="password" name="password" required type="password" />
                    <b-form-invalid-feedback :state="!validationErrors.password">
                      {{ validationErrors.password }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-form>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="w-100 d-flex">
                <b-button
                  size="lg"
                  variant="primary"
                  class="btn-auth"
                  style="min-width: 180px;"
                  type="submit"
                  form="registration"
                  :disabled="loading"
                >
                  <span v-if="!loading" style="max-width: 1em; max-height: 1em;">Register</span>
                  <b-spinner v-else></b-spinner>
                </b-button>
                <span class="p-2" />
                <b-button size="lg" variant="light" class="btn-auth" style="min-width: 180px;" @click="goBack">
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
                  Please verify email address to sign in with your new account.
                </h5>
              </b-col>
            </b-row>
            <b-row class="my-3">
              <b-col class="text-center">
                <b-button size="lg" variant="primary" class="btn-auth" style="max-width: 250px;" @click="goTo('sign-in')">
                  Continue
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row v-else-if="modalType === 'restore'">
          <b-col>
            <b-row class="my-3">
              <b-col class="text-center">
                <b-form id="restore" @submit="restore">
                  <b-form-group label="Email" label-for="email" class="text-left">
                    <b-form-input id="email" ref="restore" v-model="email" required name="email" type="email" />
                    <b-row>
                      <b-button variant="link" style="color: #696E80;" @click.prevent="goTo('restoreUser')"> Forgot Username? </b-button>
                    </b-row>
                    <b-form-invalid-feedback :state="!validationErrors.email">
                      {{ validationErrors.email }}
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback :state="emailValidation">
                      That email address does not exist in our system. Please try again.
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback :state="!otherError">
                      Error connecting to server. Please try again.
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-form>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-row class="my-3">
                  <b-col class="text-center">
                    <b-button size="lg" variant="primary" class="btn-auth" style="min-width: 180px;" type="submit" form="restore">
                      Reset password
                    </b-button>
                  </b-col>
                </b-row>
                <b-col>
                  <b-row class="my-3">
                    <b-col class="text-center">
                      <b-button size="lg" variant="light" class="btn-auth" style="min-width: 180px;" @click="goBack">
                        Back
                      </b-button>
                    </b-col>
                  </b-row>
                </b-col>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row v-else-if="modalType === 'restoreUser'">
          <b-col>
            <b-row class="my-3">
              <b-col class="text-center">
                <b-form id="restore" @submit="restoreUser">
                  <b-form-group label="Email" label-for="email" class="text-left">
                    <b-form-input id="email" ref="restore" v-model="email" required name="email" type="email" />
                    <b-form-invalid-feedback :state="!validationErrors.email">
                      {{ validationErrors.email }}
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback :state="emailValidation">
                      That email address does not exist in our system. Please try again.
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback :state="!otherError">
                      Error connecting to server. Please try again.
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-form>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <b-row class="my-3">
                  <b-col class="text-center">
                    <b-button size="lg" variant="primary" class="btn-auth" style="min-width: 180px;" type="submit" form="restore">
                      Send Username
                    </b-button>
                  </b-col>
                </b-row>
                <b-col>
                  <b-row class="my-3">
                    <b-col class="text-center">
                      <b-button size="lg" variant="light" class="btn-auth" style="min-width: 180px;" @click="goBack">
                        Back
                      </b-button>
                    </b-col>
                  </b-row>
                </b-col>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row v-else-if="modalType === 'resetConfirm'">
          <b-col>
            <b-row class="my-3 mb-3">
              <b-col class="text-center">
                <h5>
                  Please click the link sent to your email to reset your password.
                </h5>
              </b-col>
            </b-row>
            <b-row class="my-3">
              <b-col class="text-center">
                <b-button size="lg" variant="primary" class="btn-auth" style="max-width: 250px;" @click="goTo('sign-in')">
                  Continue
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row v-else-if="modalType === 'userConfirm'">
          <b-col>
            <b-row class="my-3 mb-3">
              <b-col class="text-center">
                <h5>
                  Please check your email for your username.
                </h5>
              </b-col>
            </b-row>
            <b-row class="my-3">
              <b-col class="text-center">
                <b-button size="lg" variant="primary" class="btn-auth" style="max-width: 250px;" @click="goTo('sign-in')">
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
                <b-button size="lg" variant="outline-secondary" class="btn-auth" @click="goTo('registration')">
                  Create new account
                </b-button>
              </b-col>
            </b-row>
            <b-row class="my-3">
              <b-col class="text-center">
                <b-button size="lg" variant="outline-secondary" class="btn-auth" @click="signIn()">
                  <!-- Can make a function here and if nothing is saved to press to go to sign-in modal -->
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
import { ipcRenderer } from "electron";
import { ACTION_LOGIN, ACTION_REGISTER, ACTION_RESTORE, ACTION_RESTORE_USER } from "../../store/modules/auth";
// import { UNAUTHORIZED } from '../../dispatch-types';
import { AUTHORIZED } from "../../dispatch-types";

const modalTypes = ["select", "sign-in", "confirm", "registration", "restore", "resetConfirm", "restoreUser", "userConfirm"];

const modals = {
  select: {
    title: "VoxPop"
  },
  registration: {
    title: "Create an account"
  },
  confirm: {
    title: "New account created successfully"
  },
  "sign-in": {
    title: "Sign in"
  },
  restore: {
    title: "Forgot Password"
  },
  restoreUser: {
    title: "Forgot Username"
  },
  resetConfirm: {
    title: "Password reset link sent"
  },
  userConfirm: {
    title: "Username has been sent"
  }
};

export default {
  name: "AuthModal",
  data() {
    return {
      noRedirect: false,
      username: null,
      password: null,
      email: null,
      firstName: null,
      lastName: null,
      role: null,
      rememberMe: false,
      loginValid: true,
      emailValid: true,
      otherError: false,
      loading: false,
      usernameValidation: true,
      emailValidation: true,
      msg: "",
      validationErrors: {}
    };
  },
  computed: {
    modal: {
      get() {
        return modals[this.modalType];
      }
    },
    modalType: {
      get() {
        if (!modalTypes.includes(this.$route.query.auth) || this.$authModal.forceSelect) {
          return "select";
        }

        //what i could do right here is call autologin like how login calls ACTION_LOGIN promise

        return this.$route.query.auth;
      }
    },
    show: {
      get() {
        return this.$authModal.showModal;
      },
      set(value) {
        this.$authModal.showModal = value;
      }
    },

    randFunc() {
      console.log("random function....");
      return "";
    }
  },
  created: function() {
    if (this.$store.state.firstTime == null) {
      this.$store
        .dispatchPromise("autoLogin")
        .then(data => {
          if (data != null) {
            if (!this.$route.query["no-redirect"]) {
              this.$router.push(this.$route.query.redirect || { name: "profile" });
            }
            this.$root.$emit("authorized");
          }
          this.$store.state.firstTime = true;
        })
        .catch(err => {
          const res = err && err.response;

          if (res && res.status === 404) {
            this.loginValid = false;
          } else if (res && res.status == 401) {
            this.emailValid = false;
          } else {
            this.otherError = true;
          }
          this.$store.state.firstTime = true;
        });
    }
  },

  mounted() {
    this.$root.$on("unauthorized", this.showModal);

    if (!this.$authModal.onAuthorized) {
      this.$authModal.onAuthorized = true;

      ipcRenderer.once(AUTHORIZED, () => {
        this.$authModal.showModal = false;
        this.$authModal.onAuthorized = false;
      });
    }
  },
  methods: {
    formReset() {
      this.username = null;
      this.password = null;
      this.email = null;
      this.firstName = null;
      this.lastName = null;
      this.role = null;
    },
    onHide() {
      this.$authModal.showModal = false;
      this.$authModal.forceSelect = true;
    },
    showModal(params) {
      this.noRedirect = params && !!params.noRedirect;

      this.$authModal.showModal = true;
      this.$authModal.forceSelect = false;
    },
    focusInput() {
      const input = this.$refs[this.modalType];
      this.$authModal.forceSelect = false;

      if (input) {
        input.focus();
      }
    },
    // modalChangeState() {
    //   // if (!localStorage.auth && this.$route.query.auth) {
    //     this.$emit('auth:modal:change:state');
    //   // }
    // },
    signIn() {
      //check in here if there is a value saved if not, call goTo
      //console.log("inside sign method...");
      this.goTo("sign-in");
    },

    goTo(modal = "login") {
      if (typeof modal === "object") {
        return;
      }

      this.$router.push({ query: Object.assign({}, this.$route.query, { auth: modal }, this.noRedirect ? { "no-redirect": true } : {}) });
    },
    goBack() {
      this.$router.replace({
        query: Object.assign({}, this.$route.query, { auth: "select" }, this.noRedirect ? { "no-redirect": true } : {})
      });
    },
    login(evt) {
      evt.preventDefault();

      this.loginValid = true;
      this.otherError = false;
      this.loading = true;

      this.$store
        .dispatchPromise(ACTION_LOGIN, {
          //should include remember me in here to be checked in auth.js to register remember me
          username: this.username,
          password: this.password,
          rememberMe: this.rememberMe
        })
        .then(() => {
          this.loading = false;
          this.$authModal.showModal = false;

          console.log("Authorized");

          this.formReset();

          // ipcRenderer.send(AUTHORIZED);

          if (!this.$route.query["no-redirect"]) {
            this.$router.push(this.$route.query.redirect || { name: "profile" });
          }

          this.$root.$emit("authorized");
        })
        .catch(err => {
          this.loading = false;
          console.log(err);

          const res = err && err.response;

          if (res && res.status === 404) {
            this.loginValid = false;
          } else if (res && res.status == 401) {
            this.emailValid = false;
          } else {
            this.otherError = true;
          }
        });

      // localStorage.auth = 1;
    },
    register(evt) {
      evt.preventDefault();

      const that = this;
      this.loading = true;

      this.$store
        .dispatchPromise(ACTION_REGISTER, {
          //probably an issue right in here/ this takes the values and sends them to auth.js
          // Vue-resource
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          username: this.username,
          role: this.role, //Submitting user role from the one they picked on sign in
          password: this.password
        })
        .then(() => {
          this.loading = false;
          that.$authModal.showModal = false;

          this.formReset();

          console.log("Registered");

          this.goTo("confirm");
        })
        .catch(err => {
          this.loading = false;
          const res = err.response;

          if (res && res.data) {
            this.validationErrors = res.data.userValidationResult || {};
          }

          // if (res.status === 500) {
          //   const message = res.data && res.data.message;
          //
          //   this.usernameValidation = !/username/.test(message);
          //   this.emailValidation = !/email/.test(message);
          //
          //   console.log("Incorrect username or password");
          // }
          //
          // console.log(err.response);
        });
    },
    restore(evt) {
      evt.preventDefault();

      this.otherError = false;

      const that = this;
      this.loading = true;

      this.$store
        .dispatchPromise(ACTION_RESTORE, {
          email: this.email
        })
        .then(() => {
          this.loading = false;
          that.$authModal.showModal = false;

          this.formReset();
          console.log("Restored");
          this.goTo("resetConfirm");
        })
        .catch(err => {
          this.loading = false;
          const res = err.response;

          if (res && res.status === 404) {
            this.emailValidation = false;
          } else {
            this.otherError = true;
            //this.msg = res;
          }
        });
    },
    restoreUser(evt) {
      evt.preventDefault();

      this.otherError = false;

      const that = this;
      this.loading = true;

      this.$store
        .dispatchPromise(ACTION_RESTORE_USER, {
          email: this.email
        })
        .then(() => {
          this.loading = false;
          that.$authModal.showModal = false;

          this.formReset();
          console.log("Restored");
          this.goTo("resetConfirm");
        })
        .catch(err => {
          this.loading = false;
          const res = err.response;

          if (res && res.status === 404) {
            this.emailValidation = false;
          } else {
            this.otherError = true;
            //this.msg = res;
          }
        });
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/main";

$close-size: 2em;

#modal-authorize .modal-dialog {
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

    /*.modal-body {*/
    /*  padding-bottom: 50px;*/
    /*  padding-top: 50px;*/
    /*}*/

    min-height: 300px;
    background-color: $primary-states;
  }
}
</style>
