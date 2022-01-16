const mongoose = require('mongoose')

const movie_schema = new mongoose.Schema({
  channel_id: Number,
  seen_date: Date,
  title: String,
  release_date: String,
  main_director: { name: String, Image: String },
  image_url: String,
  directors: [String],
  genres: [String],
  vote_average: Number
});

const Movie = mongoose.model('Movie', movie_schema)

module.exports = Movie