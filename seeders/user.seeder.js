const { Seeder } = require('mongoose-data-seed')
const { User } = require('../server/api/models')


const data = [
  {
    email: 'test@mail.com',
    password: 'password'
  }
]

class UserSeeder extends Seeder {
  async shouldRun() {
    return User.countDocuments()
      .exec()
      .then(count => count === 0)
  }

  async run() {
    return User.create(data)
  }
}

module.exports = UserSeeder
