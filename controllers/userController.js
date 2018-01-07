const User = require('mongoose').model('User')
const Pin = require('mongoose').model('Pin')
const Passport = require('passport')
const _ = require('lodash/core')
const imageHelper = require('./../utils/imageHelper')

// passport 的错误信息处理
const getErrorMessage = function (err) {
  let message = ''
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Email already exists'
        break
      default:
        message = 'Something went wrong'
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message
      }
    }
  }
  return message
}

const responseUserDataField = [
  'email',
  'username',
  'age',
  'gender',
  'created',
  'explicitly_followed_by_me',
  'linked_pins',
  'image_small_url',
  'image_large_url'
]

exports.login = function (req, res, next) {
  Passport
    .authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(401)
          .json('Unkonwn user')
      }
      req
        .logIn(user, function (err) {
          if (err) {
            return next(err)
          }
          res
            .status(200)
            .json(_.pick(req.user, responseUserDataField))
        })
    })(req, res, next)
}
exports.signup = function (req, res, next) {
  if (!req.user) {
    const user = new User(req.body)
    const message = null
    user.provider = 'local'
    user
      .save()
      .then((doc) => {
        req
          .login(user, function (err) {
            if (err) {
              return next(err)
            }
            res
              .status(200)
              .json(_.pick(req.user, responseUserDataField))
          })
      })
      .catch(err => {
        const message = getErrorMessage(err) // 获取错误码，返回语义化信息
        res
          .status(422)
          .json(message)
      })
  } else {
    res
      .status(200)
      .json('User already login')
  }
}

exports.logout = function (req, res, next) {
  req.logout()
  res
    .status(200)
    .json('logout successful')
}
exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    res
      .status(200)
      .json(_.pick(req.user, responseUserDataField))
  } else {
    res
      .status(401)
      .json('user didn\'t Authenticated')
  }
}

exports.createPin = function (req, res, next) {
  if (req.isAuthenticated && req.user) {
    let images
    let {dataURL, url, md5, title, description, dominant_color} = req.body
    const base64Data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    const dataBuffer = new Buffer(base64Data, 'base64');
    imageHelper(dataBuffer, md5).then(data => {
      images = data
      const pin = new Pin({
        images,
        description,
        title,
        url,
        dominant_color: dominant_color || '#e856008a',
        'created_at': new Date(),
        pinner: {
          id: req.user._id,
          username: req.user.username,
          image_small_url: req.user.image_small_url,
          image_large_url: req.user.image_large_url
        }
      })
      pin
        .save()
        .then(doc => {
          const user = User.update({
            _id: req.user.id
          }, {
            $push: { own_pins: doc._id }
          }).then(doc => {
            res.status(201).json('successful')
          })
        }).catch(err => {
            next(err)
          })
    })
  } else {
    res
      .status(401)
      .json('user didn\'t Authenticated')
  }
}

exports.getOwnPins = function (req, res, next) {
  if (req.user) {
    User
      .findOne(req.user._id)
      .then(user => {
        let own_pins = user.own_pins
        Pin
          .find({
          _id: {
            $in: own_pins
          }
        })
          .then(pins => {
            res
              .status(200)
              .json(pins)
          })
      }).catch(err => {
        next(err)
      })
  }
}

exports.delPinById = function (req, res, next) {
  const id = req.params.id
  if (req.user) {
    User.update({
      _id: req.user._id
    }, {
      $push: {
        own_pins: id
      }
    }).then(() => {
      Pin
        .remove({_id: id})
        .then(() => res.status(204))
    }).catch(err => {
      next(err)
    })
  }
}
