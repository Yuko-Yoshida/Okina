const { Seeder } = require('mongoose-data-seed')
const Model = require('../server/api/models')


const data = [
  {
    artist: 'artist1',
    title: 'title1',
    album: 'album1',
    description: 'desc1',
    artwork: 'artwork1.png',
    filepath: 'hoge/huga1.wav'
  },
  {
    artist: 'artist2',
    title: 'title2',
    album: '',
    description: '',
    artwork: '',
    filepath: 'hoge/huga2.wav'
  },
  {
    artist: 'artist3',
    title: 'title3',
    album: 'album3',
    description: 'desc3',
    artwork: 'artwork3.png',
    filepath: 'hoge/huga3.wav'
  },
]

class SongSeeder extends Seeder {
  async shouldRun() {
    return Model('Song').countDocuments()
      .exec()
      .then(count => count === 0)
  }

  async run() {
    return Model('Song').create(data)
  }
}

module.exports = SongSeeder
