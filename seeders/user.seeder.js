const { Seeder } = require('mongoose-data-seed')
const Model = require('../server/api/models')


const data = [
  {
    email: 'test@mail.com',
    password: 'password'
  }
]

class UserSeeder extends Seeder {
  async shouldRun() {
    return Model('User').countDocuments()
      .exec()
      .then(count => count === 0)
  }

  async run() {
    return Model('User').create(data)
  }
}

module.exports = UserSeeder
