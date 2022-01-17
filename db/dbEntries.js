const Movie = require('./schemas/movie')
const DBException = require('../exceptions/dbException')

async function saveMovie(movieData) {
  const newMovie = new Movie(movieData)

  try {
    const response = await newMovie.save()
    return response
  } catch {
    throw new DBException(`no se pudo guardar ${movieData.title}`)
  }
}

async function getAllMovies(serverID) {
  try {
    return await Movie.find({server_id: serverID}) 
  } catch {
    throw new DBException(`error al buscar las peliculas pertenecientes al server`)
  }
}
module.exports = { saveMovie, getAllMovies }
