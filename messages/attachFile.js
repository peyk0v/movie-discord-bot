const node_fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { AttachedNotFoundException, MovieFileAttachException } = require('../exceptions/fileException')
const { FetchMovieFileException } = require('../exceptions/fetchDataException')
const { overwritePreviousFile } = require('../movie_file/file');
const { sendFinalMsg, addSuccessMessage } = require('./messages');
const { ACTION } = require('../utils')

const ATTACHED_FILE_MESSAGE = /\*\*\*.*\*\*\*/im;

function getAttachFileURL(attachedMessages) {
  for(let message of attachedMessages) {
    if(ATTACHED_FILE_MESSAGE.test(message.content)) {
      return message.attachments.first()?.url
    }
  }
}

async function movieFileAlreadyExits(channel) {
  const attachedMessages = await filterAttachedMessages(channel)
  for(message of attachedMessages) {
    if(ATTACHED_FILE_MESSAGE.test(message.content)) {
      return true
    }
  }
  return false
}

async function getFileText(file) {
  try {
    const response = await node_fetch(file);
    if (!response.ok) {
      throw new FetchMovieFileException()
    }
    return await response.text();
  } catch (error) {
    return error;
  }
}

async function updateAttachMsg(msg, movieData, action) {
  try {
    const previousMsg = await findPreviousAttach(msg)
    await previousMsg.delete()
    await sendFinalMsg(msg, movieData)
    addSuccessMessage(msg, movieData, action)
  } catch(e) {
    throw e
  }
}

async function findPreviousAttach(msg) {
  const attachedMessages = await filterAttachedMessages(msg.channel)
  if(attachedMessages.length === 0) {
    throw new AttachedNotFoundException()
  }
  const lastMovieAttach = getLastMovieAttach(attachedMessages)
  if(!lastMovieAttach) {
    throw new MovieFileAttachException()
  };
  return lastMovieAttach
}

async function filterAttachedMessages(channel) {
  let attachedMessages = []
  const _messages = await channel.messages.fetch({limit: 50})
  if(_messages.size > 0) {
    _messages.forEach(_message => {
      if(_message.attachments.size > 0) {
        attachedMessages.push(_message)
      }
    })
  }
  return attachedMessages
}

function getLastMovieAttach(attachedMessages) {
  for(let message of attachedMessages) {
    if(ATTACHED_FILE_MESSAGE.test(message.content)) {
      return message
    }
  }
}

module.exports = { movieFileAlreadyExits, updateAttachMsg }
