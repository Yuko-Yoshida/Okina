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
                    <label class="label">Song *</label>
                    <div class="control">
                      <input class="file-input" type="file" name="resume" v-on:change="song">
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
                <label class="label">Title *</label>
                <div class="control">
                  <input type="text" class="input" v-model="title" required>
                </div>
              </div>
              <div class="field">
                <label class="label">Artist *</label>
                <div class="control">
                  <input type="text" class="input" v-model="artist" required>
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
              <div class="field">
                <div class="file">
                  <label class="file-label">
                    <label class="label">Artwork</label>
                    <div class="control">
                      <input class="file-input" type="file" name="resume" v-on:change="artwork">
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
                <button class="button is-success" v-on:click="upload">
                  Upload
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
  data () {
    return {
      token: this.$cookies.get('token')
    }
  },
  computed: {
    title: {
      get: function () {
        return this.$store.state.singleUpload.title
      },
      set: function (value) {
        this.$store.commit('singleUpload/updateTitle', value)
      }
    },
    artist: {
      get: function () {
        return this.$store.state.singleUpload.artist
      },
      set: function (value) {
        this.$store.commit('singleUpload/updateArtist', value)
      }
    },
    description: {
      get: function () {
        return this.$store.state.singleUpload.description
      },
      set: function (value) {
        this.$store.commit('singleUpload/updateDescription', value)
      }
    },
    album: {
      get: function () {
        return this.$store.state.singleUpload.album
      },
      set: function (value) {
        this.$store.commit('singleUpload/updateAlbum', value)
      }
    }
  },
  methods: {
    song: function(e) {
      console.log(e);
      e.preventDefault();
      let files = e.target.files;
      this.$store.commit('singleUpload/updateSong', files[0])
    },
    artwork: function(e) {
      console.log(e);
      e.preventDefault();
      let files = e.target.files;
      this.$store.commit('singleUpload/updateArtwork', files[0])
    },
    upload: async function() {
      const song = this.$store.state.singleUpload.song
      const title = this.$store.state.singleUpload.title
      const artist = this.$store.state.singleUpload.artist
      const description = this.$store.state.singleUpload.description
      const album = this.$store.state.singleUpload.album
      const artwork = this.$store.state.singleUpload.artwork

      const songInfo = {
        title: title,
        artist: artist,
        description: description,
        album: album
      }
      const formData = new FormData()
      formData.append('songInfo', JSON.stringify(songInfo))
      formData.append('song', song)
      formData.append('artwork', artwork)

      const token = this.token

      this.$axios.setHeader('Content-Type', 'multipart/form-data')
      this.$axios.setToken(token)
      const res = await this.$axios.$post('/api/v2/song/upload', formData)
    }
  }
}
</script>
