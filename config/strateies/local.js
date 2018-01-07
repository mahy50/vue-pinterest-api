const Passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy
      User = require('mongoose').model('User')

module.exports = function() {
  Passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'},
    function(email, password, done) {
    User.findOne({
      email,
    }, function(err, user) {
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false, {
          message: 'Unknown user'
        })
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          message: 'Invalid password'
        })
      }

      return done(null, user)
    })
  }))
}

