<template>
  <div>
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
      <label class="label">Description</label>
      <div class="control">
        <textarea class="textarea" rows="5" v-model="description"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['music'],
    computed: {
      title: {
        get: function () {
          return this.music.title
        },
        set: function (value) {
          this.music.title = value
        }
      },
      artist: {
        get: function () {
          return this.music.artist
        },
        set: function (value) {
          this.music.artist = value
        }
      },
      description: {
        get: function () {
          return this.music.description
        },
        set: function (value) {
          this.music.description = value
        }
      },
    },
    methods: {
      song: function(e) {
        e.preventDefault();
        let files = e.target.files
        this.music.file = files[0]
      },
    }
  }
</script>
