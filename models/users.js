const mongoose = require('mongoose'),
      crypto = require('crypto'),
      Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: 'Email is required',
    match: [/.+\@.+\..+/, 'Please fill a valid e-mail address']
  },
  username: {
    type: String,
    required: 'Username is required',
    trim: true
  },
  age: {
    type: Number,
  },
  gender: {
    type: String
  },
  password: {
    type: String,
    validate: [
      function(password) {
        return password && password.length > 6
      }, 'Password should be longer'
    ],
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  provider_id: String,
  provider_data: {},
  created: {
    type: Date,
    default: Date.now()
  },
  own_pins: [{
    type: Schema.Types.ObjectId,
    ref: 'Pin'
  }],
  linked_pins: [{
    type: Schema.Types.ObjectId,
    ref: 'Pin'
  }],
  explicitly_followed_by_me: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  image_small_url: String,
  image_large_url: String,
})

UserSchema.pre('save', function(next) {
  if (this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64')
    this.password = this.hashPassword(this.password)
    next()
  }
})

UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha1').toString('base64')
}

UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password)
}

UserSchema.set('toJSON', {
  getters: true,
  virtuals: true
})

module.exports = UserSchema
