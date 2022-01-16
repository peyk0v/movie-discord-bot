const fs = require('fs')
const {lineCount, formatMovieText, createEmbed, createTemporaryMessage} = require('./utils')
const { readTextFromAttachedFile } = require('./attachMovieData')
const { AttachedNotFoundException, WriteFileException } = require('./exceptions/fileException')
const { FetchEmptyFileException } = require('./exceptions/fetchDataException')

async function addMovieToAttachedFile(movieData, message) {
  try {
    const nextLineNumber = await nextMovieLineNumber(message)
    const textToWrite = formatMovieText(movieData, nextLineNumber) + '\n';
    writeTextToFile(textToWrite)
    sendFinalMsg(message, movieData)
  } catch (error) {
    throw error
  }
}

async function nextMovieLineNumber(message) {
  try {
    const wholeText = await readTextFromAttachedFile(message.channel);
    return lineCount(wholeText).toString();
  } catch (error) {
    if(error instanceof AttachedNotFoundException) {
      createTemporaryMessage(message, 'no se encontro un archivo adjunto, creando uno..', 5000)
      return 1 //brand new attach
    } else if(error instanceof FetchEmptyFileException) {
      return 1
    } else {
      throw error
    }
  }
}

function writeTextToFile(textToWrite) {
  fs.appendFile('movies.txt', textToWrite, function (err) {
    if (err) throw new WriteFileException();
    console.log('Saved!');
  });
}

function sendFinalMsg(message, movieData) {
  const embed = createEmbed(message, movieData);
  const text = '\*\*\*movie\*\*\*'
  message.channel.send({content: text, embeds: [embed], files: ["./movies.txt"] });
}

module.exports = { addMovieToAttachedFile, sendFinalMsg }