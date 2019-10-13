<template>
  <section class="hero is-primary is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-5-tablet is-4-desktop is-3-widescreen">
          <div class="column">
            <form class="box">
              <div class="field">
                <div class="file">
                  <label class="file-label">
                    <label class="label">Avater</label>
                    <div class="control">
                      <input class="file-input" type="file" v-on:change="onAvater">
                      <span class="file-cta">
                        <span class="file-label">
                          Choose a file…
                        </span>
                      </span>
                    </div>
                  </label>
                </div>
              </div>
              <button class="button is-success" v-on:click="uploadAvater">
                Upload
              </button>
              <div class="field">
                <label class="label">Artist Name</label>
                <div class="control">
                  <input type="text" class="input" v-model="name">
                </div>
              </div>
              <div class="field">
                <label class="label">Description</label>
                <div class="control">
                  <textarea class="textarea" rows="5" v-model="description"></textarea>
                </div>
              </div>
              <div class="field">
                <button class="button is-success" v-on:click="updateArtist">
                  Update
                </button>
              </div>
            </form>
            <form class="box">
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input type="text" class="input" v-model="email">
                </div>
              </div>
              <div class="field">
                <label class="label">Current Password *</label>
                <div class="control">
                  <input type="password" class="input" v-model="currentPassword" required>
                </div>
              </div>
              <div class="field">
                <label class="label">New Password</label>
                <div class="control">
                  <input type="password" class="input" v-model="newPassword">
                </div>
              </div>
              <div class="field">
                <button class="button is-success" v-on:click="updateUser">
                  Update
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
  async asyncData({ $axios }) {
    return {
      artist: await $axios.$get('/api/v2/artist'),
    }
  },
  data () {
    return {
      token: this.$cookies.get('token'),
      user: {
        email: '',
        currentPassword: '',
        newPassword: '',
      },
      avater: '',
      API_URL: process.env.API_URL
    }
  },
  computed: {
    name: {
      get: function () {
        return this.artist.name
      },
      set: function (value) {
        this.artist.name = value
      }
    },
    description: {
      get: function () {
        return this.artist.description
      },
      set: function (value) {
        this.artist.description = value
      }
    },
    email: {
      get: function () {
        return this.user.email
      },
      set: function (value) {
        this.user.email = value
      }
    },
    currentPassword: {
      get: function () {
        return this.user.currentPassword
      },
      set: function (value) {
        this.user.currentPassword = value
      }
    },
    newPassword: {
      get: function () {
        return this.user.newPassword
      },
      set: function (value) {
        this.user.newPassword = value
      }
    }
  },
  methods: {
    onAvater: function(e) {
      e.preventDefault()
      let files = e.target.files
      this.avater = files[0]
    },
    uploadAvater: function() {
      const formData = new FormData()
      formData.append('avater', this.avater)
      this.$axios.setToken(this.token)
      this.$axios.$post('/api/v2/artist/avater', formData)
    },
    updateArtist: async function() {
      const artistInfo = {
        name: this.artist.name,
        description: this.artist.description
      }

      const token = this.token
      this.$axios.setToken(token)
      const res = await this.$axios.$put('/api/v2/artist/', artistInfo)
    },
    updateUser: async function() {
      const userInfo = {
        newEmail: this.user.email,
        password: this.user.currentPassword,
        newPassword: this.user.newPassword
      }

      const token = this.token
      this.$axios.setToken(token)
      this.$cookies.removeAll()
      this.$axios.$put('/api/v2/user/', userInfo)
        .then(() => this.$cookies.removeAll())
    }
  }
}
</script>
