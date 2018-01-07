const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PinSchema = new Schema({
  id : String,
  images: {
    '236x': {
      height: Number,
      width: Number,
      url: String
    },
    origin: {
      height: Number,
      width: Number,
      url: String
    }
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  dominant_color: String,
  url: String,
  like_count: {
    type: Number,
    default: 0
  },
  liked_user : [{
    pid: String,
    username: String
  }],
  created_at: Date,
  pinner: {
    id: String,
    username: String,
    image_small_url: String,
    image_large_url: String
  }
})

// PinSchema.static('getPinById', function(id) {
//   return new Promise((resolve, reject) => {
//     this.findOne({id}, (err, doc) => {
//       if (err) {
//         reject(err)
//       } else {
//         resolve(doc)
//       }
//     })
//   })
// })

module.exports = PinSchema
