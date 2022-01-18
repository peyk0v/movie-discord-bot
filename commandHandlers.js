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
    const data = await getData(msg.content)
    const result = await saveRawData(data, msg)
    await updateServerData(msg, data, result, ACTION.ADD)
    //await overwritePreviousFile(resultObj, ACTION.ADD)
    //await updateAttachMsg(msg, data, ACTION.ADD)
  } catch(error) {
    addFailureMessage(msg, error.message)
  }
}

async function editMovie(msg) {
  try {
    const data = await getData(msg.content)
    const result = await updateRawData(data, msg)
    await updateServerData(msg, data, result, ACTION.EDIT)
  } catch(error) {
    addFailureMessage(msg, error.message)
  }
}

async function deleteMovie(msg) {
  try {
    const result = await deleteSelectedMovie(msg)
    await updateServerData(msg, result.plus_data, result, ACTION.DELETE)
  } catch(error) {
    addFailureMessage(msg, error.message)
  }
}

async function createEmptyFile(msg) {
  try {
    if(await movieFileAlreadyExits(msg.channel)) {
      throw new BaseFileExistsException()
    }
    writeTextToFile('(∩ᵔ-ᵔ)⊃━☆ﾟ.mOvIeS: eMpTy*･｡ﾟ')
    await msg.channel.send({ content:'***movies***', files: ['./movie_file/movies.txt']  })
    addSuccessMessage(msg, {title: 'none'} , ACTION.CREATE_BASE)    
  } catch (error) {
    addFailureMessage(msg, error.message)
  }
}

async function getData(content) {
  try {
    const movieID = getMovieID(content)
    return await getMovieData(movieID)
  } catch (e) {
    throw e
  }
}

async function updateServerData(msg, data, result, action) {
  try {
    await overwritePreviousFile(result, action)
    await updateAttachMsg(msg, data, action)
  } catch(e) {
    throw e
  }
}

module.exports = { addMovie, editMovie, deleteMovie, createEmptyFile };
