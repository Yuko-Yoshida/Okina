<template>
  <section class="hero is-primary is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-5-tablet is-4-desktop is-3-widescreen">
          <div class="column">
            <div v-for='(music, index) in musics'>
              <form class="box">
                <Uploader :music='musics[index]'/>
              </form>
            </div>
            <div class="field">
              <button class="button is-success" v-on:click="upload">
                Upload
              </button>
              <button class="button" v-on:click="append">
                Append
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Uploader from './components/uploader'

export default {
  components: {
    Uploader
  },
  data () {
    return {
      token: this.$cookies.get('token'),
      musics: [
        {
          title: 'test'
        }
      ]
    }
  },
  methods: {
    append: function() {
      this.musics.push({
        title: this.musics.length,
        artist: '',
        description: ''
      })
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
      const res = await this.$axios.$post('http://localhost:3000/api/v2/song/upload', formData)
    }
  }
}
</script>
