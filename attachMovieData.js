const node_fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { AttachedNotFoundException, MovieFileAttachException } = require('./exceptions/fileException')
const { FetchMovieFileException, FetchEmptyFileException } = require('./exceptions/fetchDataException')

const ATTACHED_FILE_MESSAGE = /\*\*\*.*\*\*\*/im;

async function readTextFromAttachedFile(channel) {
  const attachedMessages = await filterAttachedMessages(channel)
  if(attachedMessages.length === 0) {
    throw new AttachedNotFoundException()
  }
  const movieUrl = getMovieUrl(attachedMessages)
  if(!movieUrl) {
    throw new MovieFileAttachException()
  };
  const text = await getFileText(movieUrl)
  if(text) {
    return text
  } else {
    throw new FetchEmptyFileException()
  }
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

function getMovieUrl(attachedMessages) {
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

module.exports = { readTextFromAttachedFile, movieFileAlreadyExits }