var mongoose = require ('mongoose');

mongoose.connect('mongodb://localhost/instagram_test');

var Photo = mongoose.model('Photo', {
  tags: {
    type: [String],
    index: true
  },
  created_time: {
    type: Date,
    index: true
  },
  instagram_link: String,
  image_url: String,
  video_url: String,
  photo_id: {
    type: String,
    index: true // because we want to search using this field
  },
  user: {
    username: {
      type: String,
      index: true
    },
    id: String
  },
  likes_count: {
   type: Number,
   index: true
  },
  type: String,
  coordinates: {
    type: [Number],
    index: '2dsphere'
  },
  location: {
    latitude: Number,
    longitude: Number,
    name: String,
    id: Number
  }
});

module.exports = { Photo: Photo };