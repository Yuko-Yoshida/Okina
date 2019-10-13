const { Seeder } = require('mongoose-data-seed')
const Model = require('../server/api/models')


const data = [
  {
    name: 'test',
    description: 'hogehgoe',
    avater: 'test'
  }
]

class ArtistSeeder extends Seeder {
  async shouldRun() {
    return Model('Artist').countDocuments()
      .exec()
      .then(count => count === 0)
  }

  async run() {
    return Model('Artist').create(data)
  }
}

module.exports = ArtistSeeder
