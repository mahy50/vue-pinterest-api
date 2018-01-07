const config = require('./env-config')
const mongoose = require('mongoose')
const PinSchema = require('./../models/pins')
const UserSchema = require('./../models/users')
mongoose.Promise = global.Promise

module.exports = function() {
  mongoose.connect(config.db, {useMongoClient:true})

  const db = mongoose.connection
  // 注册Schema
  db.model('Pin', PinSchema)
  db.model('User', UserSchema)
  db.on('error', console.error.bind(console, 'mongodb 连接错误:'));
  db.once('open', function() {
      console.log('mongodb 连接成功');
  })

  return db
}
