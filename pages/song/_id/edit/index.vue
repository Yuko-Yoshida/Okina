<template>
  <section class="hero is-primary is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-5-tablet is-4-desktop is-3-widescreen">
          <div class="column">
            <div class="box">
              <form>
                <div class="field">
                  <div class="file">
                    <label class="file-label">
                      <label class="label">Artwork</label>
                      <div class="control">
                        <input class="file-input" type="file" name="resume" v-on:change="getArtwork">
                        <span class="file-cta">
                          <span class="file-label">
                            Choose a file…
                          </span>
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Title</label>
                  <div class="control">
                    <input type="text" class="input" v-model="title">
                  </div>
                </div>
                <div class="field">
                  <label class="label">Artist</label>
                  <div class="control">
                    <input type="text" class="input" v-model="artist">
                  </div>
                </div>
                <div class="field">
                  <label class="label">Album</label>
                  <div class="control">
                    <input type="text" class="input" v-model="album">
                  </div>
                </div>
                <div class="field">
                  <label class="label">Description</label>
                  <div class="control">
                    <textarea class="textarea" rows="5" v-model="description"></textarea>
                  </div>
                </div>
              </form>
              <button class="button is-success" v-on:click="update">
                Update
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
  validate({ params }) {
    return /^[0-9a-f]{0,24}$/.test(params.id)
  },
  async asyncData({ $axios, params }) {
    return {
      id: params.id,
      songInfo: await $axios.$get('/api/v2/song/'+params.id),
    }
  },
  data () {
    return {
      token: this.$cookies.get('token'),
      API_URL: process.env.API_URL
    }
  },
  computed: {
    title: {
      get: function () {
        return this.songInfo.title
      },
      set: function (value) {
        this.songInfo.title = value
      }
    },
    artist: {
      get: function () {
        return this.songInfo.artist
      },
      set: function (value) {
        this.songInfo.artist = value
      }
    },
    album: {
      get: function () {
        return this.songInfo.album
      },
      set: function (value) {
        this.songInfo.album = value
      }
    },
    description: {
      get: function () {
        return this.songInfo.description
      },
      set: function (value) {
        this.songInfo.description = value
      }
    },
  },
  methods: {
    getArtwork: function(e) {
      e.preventDefault();
      let files = e.target.files
      this.artwork = files[0]
    },
    update: function() {
      const json = {
        title: this.songInfo.title,
        artist: this.songInfo.artist,
        album: this.songInfo.album,
        description: this.songInfo.description
      }
      const formData = new FormData()
      formData.append('songInfo', JSON.stringify(json))
      formData.append('artwork', this.artwork)

      const token = this.token
      this.$axios.setHeader('Content-Type', 'multipart/form-data')
      this.$axios.setToken(token)
      return this.$axios.$put('/api/v2/song/'+this.id, formData).then(() => {
        window.location.href = this.API_URL
      })
    }
  }
}
</script>
