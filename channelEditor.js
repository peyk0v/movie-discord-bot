const fs = require('fs')
const {lineCount, formatMovieText, createEmbed, createTemporaryMessage} = require('./utils')
const { readTextFromAttachedFile } = require('./attachMovieData')
const { WriteFileException } = require('./exceptions/handleFileException')
const { AttachedNotFoundException } = require('./exceptions/fileNotFoundException')

async function addMovieToAttachedFile(movieData, message) {
  try {
    const nextLineNumber = await nextMovieLineNumber(message)
    const textToWrite = formatMovieText(movieData, nextLineNumber) + '\n';
    writeTextToFile(textToWrite)
    sendFinalMsg(message, movieData)
  } catch (error) {
    createTemporaryMessage(message, error.message, 5000)
    throw error
  }
  /*
  const wholeText = await readTextFromAttachedFile(message.channel);
  
  let nextLineNumber
  if(wholeText === ' ') {
    nextLineNumber = 1
  } else {
    nextLineNumber = lineCount(wholeText).toString();
  }
  const formattedText = formatMovieText(movieData, nextLineNumber);

  const textToWrite = formattedText + '\n';

  console.log('NEXTLINE: ' + textToWrite);
  
  fs.appendFile('test.txt', textToWrite, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  sendFinalMsg(message, movieData)
  */
}

async function nextMovieLineNumber(message) {
  try {
    const wholeText = await readTextFromAttachedFile(message.channel);
    return lineCount(wholeText).toString();
  } catch (error) {
    if(error instanceof AttachedNotFoundException) {
      createTemporaryMessage(message, 'no se encontro un archivo adjunto, creando uno..', 5000)
      return 1 //brand new attach
    } else {
      throw error
    }
  }
}

function writeTextToFile(textToWrite) {
  fs.appendFile('test.txt', textToWrite, function (err) {
    if (err) throw new WriteFileException();
    console.log('Saved!');
  });
}

function sendFinalMsg(message, movieData) {
  const embed = createEmbed(message, movieData);
  const text = '\*\*\*movie\*\*\*'
  message.channel.send({content: text, embeds: [embed], files: ["./test.txt"] });
}

module.exports = { addMovieToAttachedFile, sendFinalMsg }