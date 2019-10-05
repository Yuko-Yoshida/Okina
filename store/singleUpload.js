export const state = () => ({
  song: '',
  title: '',
  album: '',
  description: '',
  artist: '',
  artwork: ''
})

export const mutations = {
  updateSong (state, event) {
    state.song = event
  },
  updateTitle (state, event) {
    state.title = event
  },
  updateAlbum (state, event) {
    state.album = event
  },
  updateDescription (state, event) {
    state.description = event
  },
  updateArtist (state, event) {
    state.artist = event
  },
  updateArtwork (state, event) {
    state.artwork = event
  },
}
