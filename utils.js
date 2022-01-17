const { Permissions } = require('discord.js');
const ParseURLException = require('./exceptions/parseUrlException')

const ADD_MOVIE_REGEX = /^!addMovie\ +[^0-9].*/im;
const EDIT_MOVIE_REGEX = /^!editMovie\ +[0-9]+\ +.*/im;
const CREATE_FILE_REGEX = /^!createEmptyFile\ */im;

const ACTION = {
  ADD: Symbol('ADD'),
  EDIT: Symbol('EDIT'),
  DELETE: Symbol('DELETE'),
  CREATE_BASE: Symbol('CREATE_BASE')
}

function getMovieID(commandLine) {
  const singleSpaceText = eliminateSpaces(commandLine)
  try {
    const movieURI = singleSpaceText.split(/\/movie\//im)[1];
    const movieID = movieURI.split(/-/)[0]
    if(isNaN(movieID)){
      throw new ParseURLException('la url debe terminar con el siguiente formato .../movie/\*\*\*NUMERO\*\*\*-nombre-peli')
    } else {
      return movieID
    }
  } catch(e) {
    if(e instanceof ParseURLException) {
      throw e
    } else {
      throw new ParseURLException('la url debe tener el siguiente formato https://www.themoviedb.org/movie/numero-nombre-peli')
    }
  }
}

async function nextMovieLineNumber(message) {
  try {
    const wholeText = await readTextFromAttachedFile(message.channel);
    return lineCount(wholeText);
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

function numberLineToEdit(commandLine) {
  const singleSpaceText = eliminateSpaces(commandLine)
  return singleSpaceText.split(/\ /)[1];
}

function eliminateSpaces(commandLine) {
  return commandLine.replace(/[\ ]+/, ' ')
}

function lineCount(text) {
  return text.split(/[0-9]+\./).length
}

function formatMovieText(movieData, lineNumber) {
  const year = movieData.release_date.split("-")[0];
  return lineNumber + '. ' + movieData.title + " " + "(" + year + ")" + " - " + movieData.main_director.name;
}

function hasPermissions(member) {
  return member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
}



module.exports = {
  ADD_MOVIE_REGEX,
  EDIT_MOVIE_REGEX,
  CREATE_FILE_REGEX,
  getMovieID,
  hasPermissions,
  lineCount, 
  formatMovieText,
  numberLineToEdit,
  ACTION
};
