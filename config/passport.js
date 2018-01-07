var Passport = require('passport'),
    mongoose = require('mongoose')

module.exports = function() {
  var User = mongoose.model('User')

  Passport.serializeUser(function(user, done) {
    // console.log('序列化', user);
    done(null, user.id)
  })
  Passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    }, '-password -salt', function(err, user) {
      // console.log('反序列化', user);
      done(err, user)
    })
  })

  require('./strateies/local.js')()
}
