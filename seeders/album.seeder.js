const { Seeder } = require('mongoose-data-seed')
const Model = require('../server/api/models')


const data = [
  {
    artist: 'testalbum',
    title: 'testalbum',
    description: 'testalbum',
    songs: ['12345', '23456', '34567'],
    artwork: ''
  },
  {
    artist: 'testalbum',
    title: 'testalbum2',
    description: 'testalbum2',
    songs: ['12345', '23456', '34567'],
    artwork: '123456'
  },
]

class AlbumSeeder extends Seeder {
  async shouldRun() {
    return Model('Album').countDocuments()
      .exec()
      .then(count => count === 0)
  }

  async run() {
    return Model('Album').create(data)
  }
}

module.exports = AlbumSeeder
