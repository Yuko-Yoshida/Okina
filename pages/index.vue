<template>
  <div class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="https://bulma.io">
          <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: Free, open source, & modern CSS framework based on Flexbox" width="112" height="28">
        </a>

        <div class="navbar-end" v-if='isAdmin'>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Upload
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item" href="/upload/single">
                Single
              </a>
              <a class="navbar-item" href="/upload/album">
                Album
              </a>
            </div>
          </div>
        </div>

      </div>
    </nav>
    <div class="columns">
      <div class="column is-two-thirds">
        <div v-if='songInfos.length > 0'>
          <client-only>
            <aplayer
            preload="matadata"
            :music='songInfos[0]'
            :list='songInfos'
            listMaxHeight="5"
            @canplay="onSongChange"
            ref="player"
            />
          </client-only>
        </div>
        <div class="card" id="songInfo">
          <div class="card-content" id="songDesc">
            <div class="content">
              <p class="title is-4">{{ title }}</p>
              {{ desc }}
            </div>
          </div>
          <footer class="card-footer" id="songConf">
            <div v-if='isAdmin'>
              <a class="button is-primary" v-if='currentId' v-bind:href="API_URL+'/song/'+currentId+'/edit'">Edit</a>
              <a class="button is-danger" v-on:click="deleteSong">Delete</a>
            </div>
            <a class="button is-primary" v-if='currentId' v-bind:href="API_URL+'/api/v2/song/'+currentId+'/download'">Download</a>
          </footer>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">{{ artistInfo.name }}</p>
              </div>
            </div>

            <div class="content">
              {{ artistInfo.description }}
            </div>

            <footer class="card-footer" id="songConf" v-if='isAdmin'>
              <a class="button is-primary" v-bind:href="API_URL+'/user/edit'">Edit</a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'

function getSongs($axios) {
  return $axios.$get('/api/v2/song')
  .then((res) => {
    const songInfos = res.map((song) => {
      return {
        artist: song.artist,
        title: song.title,
        album: song.album,
        pic: process.env.API_URL+'/api/v2/song/'+song.id+'/artwork',
        src: process.env.API_URL+'/api/v2/song/'+song.id+'/audio'
      }
    })
    return songInfos
  })
}

export default {
  data: function() {
    const store = {
      currentId: '',
      title: '',
      artist: '',
      album: '',
      date: '',
      desc: '',
      isAdmin: (this.$cookies.get('token')) ? true : false,
      token: this.$cookies.get('token'),
      API_URL: process.env.API_URL
    }
    return store
  },
  asyncData: async function({ $axios }) {
    return {
      songInfos: await getSongs($axios),
      artistInfo: await $axios.$get('/api/v2/artist')
    }
  },
  components: {
    Aplayer
  },
  methods: {
    getCurrentSong: function() {
      const src = this.$refs.player.$refs.audio.currentSrc
      const id = src.split('/')
      return id[6]
    },
    getSongInfo: function(id) {
      return this.$axios.$get('/api/v2/song/'+id)
      .then((res) => {
        this.title = res.title
        this.artist = res.artist
        this.album = res.album
        this.date = res.date
        this.desc = res.description
      })
    },
    deleteSong: function() {
      let id = this.getCurrentSong()
      this.$axios.setToken(this.token)
      return this.$axios.$delete('/api/v2/song/'+id)
      .then(async () => {
        this.songInfos = await getSongs(this.$axios)
        id = this.getCurrentSong()
        this.getSongInfo(id)
      })
    },
    onSongChange: function() {
      const id = this.getCurrentSong()
      this.currentId = id
      return this.getSongInfo(id)
    },
    download: function() {
      this.$axios.$get('/api/v2/song/'+this.currentId+'/download')
    }
  }
}
</script>

<style>
#songInfo {
  /* bottom: 10px; */
}

#songTitle {

}

#songDesc {
  height: auto;
  white-space: pre-line;
  word-wrap: break-word;
}
</style>
