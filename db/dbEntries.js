const Movie = require('./schemas/movie')
const DBException = require('../exceptions/dbException')

async function saveMovie(movieData) {
  try {
    const newMovie = new Movie(movieData)
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

async function updateMovie(filter, newMovieData) {
  try {
    return await Movie.findOneAndUpdate(filter, newMovieData, { new: true })
  } catch(e) {
    throw new DBException(`error al actualizar la película`)
  }
}

async function deleteMovie(filter) {
  try {
    return await Movie.deleteOne(filter)
  } catch {
    throw new DBException(`error al borrar la pelicula`)
  }
}

module.exports = { saveMovie, getAllMovies, updateMovie, deleteMovie }
