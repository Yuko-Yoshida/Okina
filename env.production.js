const homedir = require('os').homedir();

module.exports = {
  mongo_url: 'mongodb://localhost:27017/okina',
  private_key: homedir+'/.ssh/id_rsa',
  public_key: homedir+'/.ssh/id_rsa.pub',
  API_URL: ''
}
