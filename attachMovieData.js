const node_fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { AttachedNotFoundException, MovieFileAttachException } = require('./exceptions/fileNotFoundException')
const { FetchTMDBException, FetchMovieFileException } = require('./exceptions/fetchDataException')

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
  return await getFileText(movieUrl)
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
      console.log('ATTACHED FILE MATCHED')
      return message.attachments.first()?.url
    }
  }
}

async function getFileText(file) {
  try {
    const response = await node_fetch(file);

    if (!response.ok) {
      throw new FetchMovieFileException()
    }

    const text = await response.text();

    if (text) {
      return text;
    }
  } catch (error) {
    return error;
  }
}

module.exports = { readTextFromAttachedFile }