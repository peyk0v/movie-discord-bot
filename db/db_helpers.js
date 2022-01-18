const Movie = require('./schemas/movie')
const DBException = require('../exceptions/dbException')
const { formatMovieText, numberLineFromMessage } = require('../utils')
const { saveMovie, getAllMovies, updateMovie, deleteMovie } = require('./dbEntries')

async function saveRawData(movieData, msg) {
  try {
    const serverId = msg.guild.id
    const allServerMovies = await getAllMovies(serverId)
    const newMovie = adaptDataToSchema(movieData, serverId)
    const addedMovie = await saveMovie(newMovie)
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
    let allServerMovies = await getAllMovies(serverId)
    const editLine = numberLineFromMessage(msg.content)
    if(editLine <= 0 || editLine > allServerMovies.length) {
      throw new Error('el numero de linea a editar no es valido')
    }
    const dataToEdit = allServerMovies[editLine - 1]
    const adaptedNewData = fieldsToUpdate(newData)
    const result = await updateMovie({_id: dataToEdit._id}, adaptedNewData)
    allServerMovies[editLine - 1] = result
    return {
      all_movies: allServerMovies,
      plus_data: dataToEdit
    }
  } catch(e) {
    throw e
  }
}
/*
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
*/

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
