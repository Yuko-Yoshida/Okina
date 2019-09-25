import { Seeder } from 'mongoose-data-seed'
import { User } from '~/server/api/models'


const data = [
  {
    email: 'test@gmail.com',
    password: 'password',
    passwordConfirmation: 'password'
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

export default UserSeeder
