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
                <label class="label">Title *</label>
                <div class="control">
                  <input type="text" class="input" v-model="Title" required>
                </div>
              </div>
              <div class="field">
                <label class="label">Artist *</label>
                <div class="control">
                  <input type="text" class="input" v-model="Artist" required>
                </div>
              </div>
              <div class="field">
                <label class="label">Description</label>
                <div class="control">
                  <textarea class="textarea" rows="5" v-model="Description"></textarea>
                </div>
              </div>
            </form>
            <div v-for='(music, index) in musics'>
              <form class="box">
                <Uploader :music='musics[index]'/>
              </form>
              <button class="button is-denger" v-on:click="del(index)" v-if='musics.length > 1'>
                Delete
              </button>
              <button class="button" v-on:click="swap(index, index-1)" v-if='index > 0'>
                Up
              </button>
              <button
                class="button"
                v-on:click="swap(index, index+1)"
                v-if='index < musics.length-1'>
                Down
              </button>
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
          title: 0
        }
      ],
      artwork: '',
      album: 'test444',
      description: '',
      artist: 'test444'
    }
  },
  computed: {
    Title: {
      get: function () {
        return this.album
      },
      set: function (value) {
        this.album = value
      }
    },
    Artist: {
      get: function () {
        return this.artist
      },
      set: function (value) {
        this.artist = value
      }
    },
    Description: {
      get: function () {
        return this.description
      },
      set: function (value) {
        this.description = value
      }
    },
  },
  methods: {
    append: function() {
      this.musics.push({
        title: this.musics.length,
        artist: '',
        description: ''
      })
    },
    del: function(index) {
      this.musics.splice(index, 1)
    },
    swap: function(from, to) {
      const temp = this.musics[to]
      this.musics[to] = this.musics[from]
      this.musics[from] = temp
      // update array
      this.musics.push({})
      this.musics.pop({})
    },
    getArtwork: function(e) {
      e.preventDefault();
      let files = e.target.files
      this.artwork = files[0]
    },
    uploadSong: async function(music) {
      const song = music.file
      const title = music.title
      const artist = music.artist
      const description = music.description
      const artwork = this.artwork
      const album = this.album

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

      return res.id
    },
    upload: async function() {
      const promises = this.musics.map(music => this.uploadSong(music))
      const ids = await Promise.all(promises)

      const albumInfo = {
        title: this.album,
        artist: this.artist,
        description: this.description,
        songs: ids
      }
      const formData = new FormData()
      formData.append('albumInfo', JSON.stringify(albumInfo))
      formData.append('artwork', this.artwork)

      const token = this.token
      this.$axios.setHeader('Content-Type', 'multipart/form-data')
      this.$axios.setToken(token)
      const res = await this.$axios.$post('http://localhost:3000/api/v2/album/upload', formData)
    }
  }
}
</script>
