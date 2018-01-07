const mongoose = require('mongoose')
const Pin = mongoose.model('Pin')

exports.getPins = function(req, res, next) {
  let page = parseInt(req.query.page) || 1
  let pageSize = parseInt(req.query.pageSize) || 10
  let skip = (page - 1) * pageSize
  let text = req.query.text
  let pin

  if (text) {
    pin = Pin.find({$text: {$search: text}}).sort({'created_at': -1})
             .skip(skip).limit(pageSize).exec()
  } else {
    pin = Pin.find({}).sort({'created_at': -1}).skip(skip).limit(pageSize).exec()
  }
  pin.then(json => {
    res.status(200).json(json)
  }).catch(err => {
    next(err)
  })
}

exports.getPinById = function(req, res, next) {
  let id = req.params.id
  let pin = Pin.findOne({_id:id})
    .then(json => {
      res.status(200).json(json)
  }).catch(err => {
    next(err)
  })
}

exports.updatePin = function(req, res, next) {
  const id = req.params.id
  const { title, url, description } = req.body
  Pin.update({_id: id}, {
    title,
    url,
    description
  }).then(() => {
    res.status(200).end()
  })
}



