const Movie = require('./schemas/movie')
const DBException = require('../exceptions/dbException')
const { formatMovieText } = require('../utils')
const { saveMovie, getAllMovies } = require('./dbEntries')

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
      new_movie: addedMovie
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

module.exports = { saveRawData }
