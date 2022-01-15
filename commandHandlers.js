const getMovieData = require('./services/tmdb')
const { getMovieID, editMovieLine, updateMovieLine } = require('./utils')
const { addMovieToAttachedFile } = require('./channelEditor')
const ParseURLException = require('./exceptions/parseUrlException')

async function addMovie(msg) {
  try {
    const movieID = getMovieID(msg.content)
    const data = await getMovieData(movieID)
    msg.reply(`TO ADD: titulo: ${data.title}, director: ${data.directors[0]}`)
    await addMovieToAttachedFile(data, msg)
  } catch(error) {
    if(error instanceof ParseURLException) {
      msg.reply(error.message)
    } else {
      msg.reply('NAAA QUE HICISTE CHABON')
      console.log(error)
    }
  } 
}

async function editMovie(msg) {
  try {
    const movieID = getMovieID(msg.content)
    const dataToUpdate = await getMovieData(movieID)
    msg.reply(`TO EDIT: titulo: ${dataToUpdate.title}, director: ${dataToUpdate.director[0]}`)
    updateMovieLine(dataToUpdate, msg.content)
  } catch(e) {
    msg.reply('NAAA QUE HICISTE CHABON')
    console.log('ALGO SALIO MAL: ' + e.message)
  }
}

module.exports = { addMovie, editMovie };
