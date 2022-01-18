const Movie = require('./schemas/movie')
const DBException = require('../exceptions/dbException')
const { formatMovieText, numberLineFromMessage } = require('../utils')
const { saveMovie, getAllMovies, updateMovie, deleteMovie } = require('./dbEntries')

async function saveRawData(movieData, msg) {
  try {
    const serverId = msg.guild.id
    const allServerMovies = await getAllMovies(serverId)
    const textToWrite = formatMovieText(movieData);
    const newMovie = adaptDataToSchema(movieData, textToWrite, serverId)
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
    const editLine = numberLineFromMessage(msg.content)
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

async function deleteSelectedMovie(msg) {
  try {
    const serverId = msg.guild.id
    const deleteLine = numberLineFromMessage(msg.content)
    const filter = { server_id: serverId, line_number: deleteLine }
    const deletedData = await deleteMovie(filter)
    const allServerMovies = await getAllMovies(serverId) 
    return {
      all_movies : allServerMovies,
      plus_data: allServerMovies.at(-1)
    }
  } catch(e) {
    throw e
  }
}

function adaptDataToSchema(movieData, text, serverId) {
  const newMovie = {
    ...movieData, 
    vote_average: Number(movieData.vote_average),
    server_id: serverId,
    seen_date: new Date(),
    line_text: text
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

/*function adaptLastMovie(allServerMovies) {
  let lastMovie = allServerMovies.at(-1)
  console.log('ULTIMA PELI')
  console.log(lastMovie)
  lastMovie.vote_average = lastMovie.vote_average.toString()
  console.log('ULTIMA PELI renovada')
  console.log(lastMovie)
  return lastMovie
}*/

module.exports = { saveRawData, updateRawData, deleteSelectedMovie }
