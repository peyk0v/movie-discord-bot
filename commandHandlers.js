const getMovieData = require('./services/tmdb')
const { addMovieToAttachedFile } = require('./channelEditor')
const { BaseFileExistsException } = require('./exceptions/fileException')
const { movieFileAlreadyExits } = require('./attachMovieData')
const {
  getMovieID, 
  editMovieLine, 
  updateMovieLine, 
  createTemporaryMessage, 
  addSuccessMessage,
  createBaseFile,
  addFailureMessage,
  ACTION 
} = require('./utils')

async function addMovie(msg) {
  try {
    const movieID = getMovieID(msg.content)
    const data = await getMovieData(movieID)
    await addMovieToAttachedFile(data, msg)
    addSuccessMessage(msg, data, ACTION.ADD)
  } catch(error) {
    addFailureMessage(msg, error.message)
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

async function createEmptyFile(msg) {
  try {
    if(await movieFileAlreadyExits(msg.channel)) {
      throw new BaseFileExistsException()
    }
    createBaseFile()
    msg.channel.send({ content:'***movies***', files: ['./movies.txt']  })
  } catch (error) {
    addFailureMessage(msg, error.message)
  }
}


module.exports = { addMovie, editMovie, createEmptyFile };
