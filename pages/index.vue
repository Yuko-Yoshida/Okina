<template>
  <div class="container">
    <no-ssr>
      <aplayer preload="matadata"
        :music="{
          title: 'secret base~君がくれたもの~',
          artist: 'Silent Siren',
          src: 'http://localhost:3000/api/v2/song/5d92e96b3560c6b13d5491a4/audio',
          pic: 'http://moeplayer.b0.upaiyun.com/aplayer/secretbase.jpg'
        }"
      />
    </no-ssr>
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'

export default {
  components: {
    Aplayer
  }
}
</script>

<style>

</style>
