<template>
  <section class="hero is-primary is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5-tablet is-4-desktop is-3-widescreen">
            <div class="box">
              <form action="">
                <div class="field">
                  <label for="" class="label">Email</label>
                  <div class="control has-icons-left">
                    <input type="email" placeholder="e.g. bobsmith@gmail.com" class="input" v-model="email" required>
                    <span class="icon is-small is-left">
                      <i class="fa fa-envelope"></i>
                    </span>
                  </div>
                </div>
                <div class="field">
                  <label for="" class="label">Password</label>
                  <div class="control has-icons-left">
                    <input type="password" placeholder="*******" class="input" v-model="password" required>
                    <span class="icon is-small is-left">
                      <i class="fa fa-lock"></i>
                    </span>
                  </div>
                </div>
                <div class="field">
                  <label for="" class="checkbox">
                    <input type="checkbox">
                   Remember me
                  </label>
                </div>
              </form>
              <button class="button is-success" v-on:click="login">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
export default {
  data() {
    return {
      API_URL: process.env.API_URL
    }
  },
  computed: {
    email: {
      get: function () {
        return this.$store.state.login.email
      },
      set: function (value) {
        this.$store.commit('login/updateEmail', value)
      }
    },
    password: {
      get: function () {
        return this.$store.state.login.password
      },
      set: function (value) {
        this.$store.commit('login/updatePassword', value)
      }
    }
  },
  methods: {
    login: function() {
      const email = this.$store.state.login.email
      const password = this.$store.state.login.password
      return this.$axios.$post('/api/v2/login', {
        email: email, password: password
      }).then((res) => {
        this.$cookies.set('token', res.token, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        })
        window.location.href = this.API_URL
      })
    }
  }
}
</script>
