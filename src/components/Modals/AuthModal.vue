<template>
  <b-modal centered no-close-on-backdrop no-close-on-esc v-model="show" id="modal-authorize" content-class="rounded-lg">
    <div class="h-100 d-flex">
      <div class="m-auto">
        <b-row class="mb-3">
          <b-col>
            <h1 class="text-white font-weight-normal text-center">{{ modal.title }}</h1>
          </b-col>
        </b-row>
        <b-row v-if="modalType === 'sign-in'">
          <b-col>
            <b-row class="my-3">
              <b-col class="text-center">
                <b-form id="sign-in" @submit="login">
                  <b-form-group label="Username" label-for="username" class="text-left">
                    <b-form-input id="username" name="username" required placeholder="Username" type="text" />
                  </b-form-group>
                  <b-form-group label="Password" label-for="password" class="text-left">
                    <b-form-input id="password" name="password" required placeholder="Password" type="password"/>
                  </b-form-group>
                  <b-form-checkbox class="text-left">Remember me</b-form-checkbox>
                </b-form>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="mt-5 w-100 d-flex">
                <b-button size="lg" variant="primary" class="btn-auth" style="min-width: 180px;" type="submit" form="sign-in">
                  Login
                </b-button>
                <span class="p-2"></span>
                <b-button size="lg" variant="light" class="btn-auth" style="min-width: 180px;" @click="goBack">
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
                <b-form id="registration" @submit="register">
                  <b-form-group label="First Name" label-for="firstname" class="text-left">
                    <b-form-input id="firstname" name="firstname" required placeholder="First Name" type="text" />
                  </b-form-group>
                  <b-form-group label="Last Name" label-for="lastname" class="text-left">
                    <b-form-input id="lastname" name="lastname" required placeholder="Last Name" type="text" />
                  </b-form-group>
                  <b-form-group label="Username" label-for="username" class="text-left">
                    <b-form-input id="username" name="username" required placeholder="Username" type="text" />
                  </b-form-group>
                  <b-form-group label="Email" label-for="email" class="text-left">
                    <b-form-input id="email" name="email" required placeholder="Email" type="email" />
                  </b-form-group>
                  <b-form-group label="Password" label-for="password" class="text-left">
                    <b-form-input id="password" name="password" required placeholder="Password" type="password"/>
                  </b-form-group>
                </b-form>
              </b-col>
            </b-row>
            <b-row>
              <b-col class="mt-5 w-100 d-flex">
                <b-button size="lg" variant="primary" class="btn-auth" style="min-width: 180px;" type="submit" form="registration">
                  Register
                </b-button>
                <span class="p-2"></span>
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
                  Please close this window or click continue to sing in with your new account.
                </h5>
              </b-col>
            </b-row>
            <b-row class="my3">
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
            <b-row class="my3">
              <b-col class="text-center">
                <b-button size="lg" variant="outline-secondary" class="btn-auth" @click="goTo('sign-in')">
                  Sign in
                </b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
    </div>

    <template slot="modal-footer">
      <div style="display: none;"></div>
    </template>
  </b-modal>
</template>

<script>
  const modalTypes = ['select', 'sign-in', 'confirm', 'registration'];

  const modals = {
    select: {
      title: 'VoxPop'
    },
    registration: {
      title: 'Create an account'
    },
    confirm: {
      title: 'New account created successfully'
    },
    'sign-in': {
      title: 'Sign in'
    }
  };

  export default {
    name: 'auth-modal',
    data() {
      return {
        show: false,
      }
    },
    methods: {
      showModal() {
        this.show = true;
      },
      goTo(modal = 'login') {
        if (typeof modal === 'object') {
          return;
        }

        this.$router.push({query: Object.assign({}, this.$route.query, {auth: modal})});
      },
      goBack() {
        this.$router.replace({query: Object.assign({}, this.$route.query, {auth: 'select'})});
      },
      login(evt) {
        evt.preventDefault();

        console.log('Authorized');

        //localStorage.auth = 1;
        //this.$router.push(this.$route.query.redirect || {name: 'profile'});
      },
      register(evt) {
        evt.preventDefault();

        console.log('Registered');

        this.goTo('confirm');
      },
    },
    computed: {
      modal: {
        get() {
          return modals[this.modalType];
        }
      },
      modalType: {
        get() {
          if (!modalTypes.includes(this.$route.query.auth)) {
            return 'select';
          } else {
            return this.$route.query.auth;
          }
        }
      }
    },
    mounted() {
      this.$root.$on('unauthorized', this.showModal);
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/scss/main";

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
