const Movie = require('./schemas/movie')
const DBException = require('../exceptions/dbException')
const { formatMovieText, numberLineFromMessage } = require('../utils')
const { saveMovie, getAllMovies, updateMovie, deleteMovie } = require('./dbEntries')

async function saveRawData(movieData, msg) {
  try {
    const serverId = msg.guild.id
    const newMovie = adaptDataToSchema(movieData, serverId)
    const addedMovie = await saveMovie(newMovie)
    const allServerMovies = await getAllMovies(serverId)
    return {
      all_movies: allServerMovies,
      plus_data: addedMovie
    }
  } catch(e) {
    throw e
  }
}

async function updateRawData(newData, msg) {
  try {
    const serverId = msg.guild.id
    let movies = await getAllMovies(serverId)
    const { data, line } = getDesireData(msg.content, movies)
    const adaptedNewData = fieldsToUpdate(newData)
    const result = await updateMovie({ _id: data._id }, adaptedNewData)
    movies[line - 1] = result
    return {
      all_movies: movies,
      plus_data: data
    }
  } catch(e) {
    throw e
  }
}

async function deleteSelectedMovie(msg) {
  try {
    const serverId = msg.guild.id
    const movies = await getAllMovies(serverId)
    const { data, line } = getDesireData(msg.content, movies)
    await deleteMovie({ _id: data._id })
    const surviveMovies = movies.filter(movie => movie !== data)
    return {
      all_movies : surviveMovies,
      plus_data: surviveMovies.at(-1)
    }
  } catch(e) {
    throw e
  }
}

function getDesireData(content, movies) {
  const line = numberLineFromMessage(content)
  if(line <= 0 || line > movies.length) {
    throw new Error('el numero de linea a editar no es valido')
  }
  return { data: movies[line - 1], line: line } 
}

function adaptDataToSchema(movieData, serverId) {
  const text = formatMovieText(movieData);
  const newMovie = {
    ...movieData, 
    vote_average: Number(movieData.vote_average),
    server_id: serverId,
    seen_date: new Date(),
    line_text: text
  }
  return newMovie
}

function fieldsToUpdate(movieData) {
  const newText = formatMovieText(movieData)
  const newMovie = {
    ...movieData,
    vote_average: Number(movieData.vote_average),
    line_text: newText
  }
  return newMovie
}

module.exports = { saveRawData, updateRawData, deleteSelectedMovie }
