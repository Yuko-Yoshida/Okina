<template>
  <section class="hero is-primary is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-5-tablet is-4-desktop is-3-widescreen">
            <form action="" class="box">
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
                <label for="" class="label">Retype Password</label>
                <div class="control has-icons-left">
                  <input type="password" placeholder="*******" class="input" v-model="retypePassword" required>
                  <span class="icon is-small is-left">
                    <i class="fa fa-lock"></i>
                  </span>
                </div>
              </div>
              <div>
                <button class="button is-success" v-on:click="create">
                  Create
                </button>
              </div>
            </form>
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
      email: '',
      password: '',
      retypePassword: ''
    }
  },
  computed: {
    email: {
      set: function (value) {
        this.email = value
      }
    },
    password: {
      set: function (value) {
        this.password = value
      }
    },
    retypePassword: {
      set: function (value) {
        this.retypePassword = value
      }
    }
  },
  methods: {
    create: async function() {
      const email = this.email
      const password = this.password
      const retypePassword = this.retypePassword
      const res = await this.$axios.$post('/api/v2/user/new', {
        email: email, password: password, retypePassword: retypePassword
      })
      window.location.href = 'http://localhost:3000/'
    }
  }
}
</script>
