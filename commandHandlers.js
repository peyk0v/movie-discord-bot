const getMovieData = require('./services/tmdb')
const { addMovieToAttachedFile } = require('./messages/attachFile')
const { BaseFileExistsException } = require('./exceptions/fileException')
const { movieFileAlreadyExits, updateAttachMsg } = require('./messages/attachFile')
const { saveRawData } = require('./db/db_helpers')
const { overwritePreviousFile, createBaseFile, writeTextToFile } = require('./movie_file/file')
const { sendFinalMsg, addFailureMessage, addSuccessMessage } = require('./messages/messages')
const {
  getMovieID, 
  updateMovieLine,
  ACTION 
} = require('./utils')

async function addMovie(msg) {
  try {
    const movieID = getMovieID(msg.content)
    const data = await getMovieData(movieID)
    const resultObj = await saveRawData(data, msg)
    await overwritePreviousFile(resultObj)
    await updateAttachMsg(msg, data)
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
    writeTextToFile('(∩ᵔ-ᵔ)⊃━☆ﾟ.mOvIeS eMpTy*･｡ﾟ')
    await msg.channel.send({ content:'***movies***', files: ['./movie_file/movies.txt']  })
    addSuccessMessage(msg, {title: 'none'} , ACTION.CREATE_BASE)    
  } catch (error) {
    addFailureMessage(msg, error.message)
  }
}


module.exports = { addMovie, editMovie, createEmptyFile };
