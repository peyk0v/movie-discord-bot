const mongoose = require('mongoose')

const movie_schema = new mongoose.Schema({
  movie_id: Number,
  server_id: String,
  seen_date: Date,
  title: String,
  release_date: String,
  main_director: { name: String, image: String },
  image_url: String,
  directors: [String],
  genres: [String],
  vote_average: Number,
  line_text: String
});

const Movie = mongoose.model('Movie', movie_schema)

module.exports = Movie