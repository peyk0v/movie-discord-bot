const getMovieData = require('./services/tmdb')
const { addMovieToAttachedFile } = require('./messages/attachFile')
const { BaseFileExistsException } = require('./exceptions/fileException')
const { movieFileAlreadyExits, updateAttachMsg } = require('./messages/attachFile')
const { saveRawData, updateRawData, deleteSelectedMovie } = require('./db/db_helpers')
const { overwritePreviousFile, createBaseFile, writeTextToFile } = require('./movie_file/file')
const { sendFinalMsg, addFailureMessage, addSuccessMessage } = require('./messages/messages')
const {
  getMovieID,
  ACTION 
} = require('./utils')

async function addMovie(msg) {
  try {
    const movieID = getMovieID(msg.content)
    const data = await getMovieData(movieID)
    const resultObj = await saveRawData(data, msg)
    await overwritePreviousFile(resultObj)
    await updateAttachMsg(msg, data, ACTION.ADD)
  } catch(error) {
    addFailureMessage(msg, error.message)
  }
}

async function editMovie(msg) {
  try {
    const movieID = getMovieID(msg.content)
    const dataToUpdate = await getMovieData(movieID)
    const resultObj = await updateRawData(dataToUpdate, msg)
    await overwritePreviousFile(resultObj)
    await updateAttachMsg(msg, dataToUpdate, ACTION.EDIT)
  } catch(error) {
    addFailureMessage(msg, error.message)
  }
}

async function deleteMovie(msg) {
  try {
    const resultObj = await deleteSelectedMovie(msg)
    await overwritePreviousFile(resultObj)
    await updateAttachMsg(msg, resultObj.plus_data, ACTION.DELETE)
  } catch(error) {
    addFailureMessage(msg, error.message)
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


module.exports = { addMovie, editMovie, deleteMovie, createEmptyFile };
