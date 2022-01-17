const Movie = require('./schemas/movie')
const DBException = require('../exceptions/dbException')
const { formatMovieText, numberLineToEdit } = require('../utils')
const { saveMovie, getAllMovies, updateMovie } = require('./dbEntries')

async function saveRawData(movieData, msg) {
  try {
    const serverId = msg.guild.id
    const allServerMovies = await getAllMovies(serverId)
    const nextLineNumber = allServerMovies.length + 1
    const textToWrite = formatMovieText(movieData, nextLineNumber);
    const newMovie = adaptDataToSchema(movieData, textToWrite, serverId, nextLineNumber)
    const addedMovie = await saveMovie(newMovie)
    return {
      all_movies: allServerMovies,
      plus_data: addedMovie
    }
  } catch(e) {
    throw e
  }
}

async function updateRawData(movieData, msg) {
  try{ 
    const serverId = msg.guild.id
    const editLine = numberLineToEdit(msg.content)
    const filter = { server_id: serverId, line_number: editLine }
    const newLineText = formatMovieText(movieData, editLine);
    const dataToUpdate = fieldsToUpdate(movieData, newLineText)
    const oldMovieData = await updateMovie(filter, dataToUpdate)
    const allServerMovies = await getAllMovies(serverId)
    return {
      all_movies: allServerMovies,
      plus_data: oldMovieData
    }
  } catch(e) {
    throw e
  }
}

function adaptDataToSchema(movieData, text, serverId, lineNumber) {
  const newMovie = {
    ...movieData, 
    vote_average: Number(movieData.vote_average),
    server_id: serverId,
    seen_date: new Date(),
    line_text: text,
    line_number: lineNumber
  }
  return newMovie
}

function fieldsToUpdate(movieData, newText) {
  const newMovie = {
    ...movieData,
    vote_average: Number(movieData.vote_average),
    line_text: newText
  }
  return newMovie
}

module.exports = { saveRawData, updateRawData }
