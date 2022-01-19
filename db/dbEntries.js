const Movie = require('./schemas/movie')
const Role = require('./schemas/role')
const DBException = require('../exceptions/dbException')

async function saveMovie(movieData) {
  try {
    const newMovie = new Movie(movieData)
    return await newMovie.save()
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

async function saveRole(role) {
  try {
    const newRole = new Role(role)
    return await newRole.save()
  } catch {
    throw new DBException(`no se pudo guardar el rol ${role.name}`)
  }
}

async function deleteRole(filter) {
  try {
    return await Role.deleteOne(filter)
  } catch {
    throw new DBException(`error al remover el rol`)
  }
}

async function getAllRoles(serverID) {
  try {
    return await Role.find({ server_id: serverID }) 
  } catch {
    throw new DBException(`error al buscar las peliculas pertenecientes al server`)
  }
}

module.exports = { saveMovie, getAllMovies, updateMovie, deleteMovie, saveRole, deleteRole, getAllRoles }
