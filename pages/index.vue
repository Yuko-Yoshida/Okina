<template>
  <div class="container">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="https://bulma.io">
          <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: Free, open source, & modern CSS framework based on Flexbox" width="112" height="28">
        </a>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
    </nav>
    <div class="columns">
      <div class="column is-two-thirds">
        <no-ssr>
          <aplayer
            preload="matadata"
            :music='songInfos[0]'
            :list='songInfos'
            listMaxHeight="5"
            @canplay="getCurrentSong"
            ref="player"
          />
        </no-ssr>
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              {{ title }}
            </p>
          </header>
          <div class="card-content">
            <div class="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
              <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
              <br>
            </div>
          </div>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'

export default {
  data: function() {
    return {
      currentId: '',
      title: '',
      artist: '',
      album: '',
      date: ''
    }
  },
  asyncData: function({ $axios }) {
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
      return { songInfos: songInfos }
    })
  },
  components: {
    Aplayer
  },
  methods: {
    getCurrentSong: function() {
      const src = this.$refs.player.$refs.audio.currentSrc
      const id = src.split('/')
      this.currentId = id[6]
      this.getSongInfo(this.currentId)
    },
    getSongInfo: function(id) {
      return this.$axios.$get('http://localhost:3000/api/v2/song/'+id)
              .then((res) => {
                this.title = res.title
                this.artist = res.artist
                this.album = res.album
                this.date = res.date
              })
    }
  }
}
</script>

<style>

</style>
