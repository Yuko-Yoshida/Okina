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
          <header class="card-header" id="songTitle">
            <p class="card-header-title">
              {{ title }}
            </p>
          </header>
          <div class="card-content" id="songDesc">
            <div class="content">
              {{ artist }}, {{ album }}, {{ desc }}, {{ date }}
            </div>
          </div>
          <footer class="card-footer" id="songConf" v-if='isAdmin'>
            <a class="button is-primary">Edit</a>
            <a class="button is-danger" v-on:click="deleteSong">Delete</a>
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
                <p class="title is-4">John Smith</p>
                <p class="subtitle is-6">@johnsmith</p>
              </div>
            </div>

            <div class="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Phasellus nec iaculis mauris. <a>@bulmaio</a>.
              <a href="#">#css</a> <a href="#">#responsive</a>
              <br>
              <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </div>

            <footer class="card-footer" id="songConf" v-if='isAdmin'>
              <a class="button is-primary">Edit</a>
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
  return $axios.$get('http://localhost:3000/api/v2/song')
  .then((res) => {
    const songInfos = res.map((song) => {
      return {
        artist: song.artist,
        title: song.title,
        album: song.album,
        pic: 'http://localhost:3000/api/v2/song/'+song.id+'/artwork',
        src: 'http://localhost:3000/api/v2/song/'+song.id+'/audio'
      }
    })
    return songInfos
  })
}

export default {
  data: function() {
    return {
      currentId: '',
      title: '',
      artist: '',
      album: '',
      date: '',
      desc: '',
      isAdmin: (this.$cookies.get('token')) ? true : false,
      token: this.$cookies.get('token')
    }
  },
  asyncData: async function({ $axios }) {
    return {
      songInfos: await getSongs($axios)
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
      return this.$axios.$get('http://localhost:3000/api/v2/song/'+id)
      .then((res) => {
        this.title = res.title
        this.artist = res.artist
        this.album = res.album
        this.date = res.date
      })
    },
    deleteSong: function() {
      let id = this.getCurrentSong()
      this.$axios.setToken(this.token)
      return this.$axios.$delete('http://localhost:3000/api/v2/song/'+id)
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
}
</style>
