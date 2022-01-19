const { Permissions } = require('discord.js');
const ParseURLException = require('./exceptions/parseUrlException')
const { getSavedRoles } = require('./db/db_helpers');
const { find } = require('./db/schemas/movie');

const ADD_MOVIE_REGEX = /^!addMovie\ +[^0-9][^\ ]*$/im;
const EDIT_MOVIE_REGEX = /^!editMovie\ +[0-9]+\ +[^\ ]*$/im;
const DELETE_MOVIE_REGEX = /^!deleteMovie\ +[0-9]+$/im;
const CREATE_FILE_REGEX = /^!createEmptyFile\ */im;
const LIST_ROLES = /^!listRoles\ */im
const ADD_PERMISSION_ROLE = /^!addPermissionRole\ +[0-9]+$/im
const REMOVE_PERMISSION_ROLE = /^!removePermissionRole\ +[0-9]+$/im

const ACTION = {
  ADD: Symbol('ADD'),
  EDIT: Symbol('EDIT'),
  DELETE: Symbol('DELETE'),
  CREATE_BASE: Symbol('CREATE_BASE'),
  ADD_ROLE: Symbol('ADD_ROLE'),
  REMOVE_ROLE: Symbol('REMOVE_ROLE'),
  LIST_SERVER_ROLES: Symbol('LIST_SERVER_ROLES'),
  LIST_SAVED_ROLES: Symbol('LIST_SAVED_ROLES')
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

function numberLineFromMessage(commandLine) {
  const singleSpaceText = eliminateSpaces(commandLine)
  return singleSpaceText.split(/\ /)[1];
}

function eliminateSpaces(commandLine) {
  return commandLine.replace(/[\ ]+/, ' ')
}

function lineCount(text) {
  return text.split(/[0-9]+\./).length
}

function formatMovieText(movieData) {
  const year = movieData.release_date.split("-")[0];
  return movieData.title + " " + "(" + year + ")" + " - " + movieData.main_director.name;
}

async function hasPermissions(msg) {
  const isAdmin = msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  const savedRoles = await getSavedRoles(msg)
  const savedRolesID = savedRoles.map(role => role.id)
  const userRoles = msg.member.roles.cache.map(role => role.id)
  let hasRolePermission = false
  for(let savedRole of savedRolesID) {
    if(userRoles.includes(savedRole)) {
      hasRolePermission = true
    }
  }
  return hasRolePermission || isAdmin
}

function joinTextWithIndex(moviesText) {
  let text = ''
  moviesText.forEach((movie, index) => {
    const _index = (index + 1).toString()
    text = text.concat(_index + '. ' + movie + '\n')
  })
  return text
}

function serverRoles(server) {
  let roles = []
  let index = 1
  server.roles.cache.each(role => {
    roles.push({ name: role.name, id: role.id, index: index })
    index++
  })
  return roles
}

module.exports = {
  ADD_MOVIE_REGEX,
  EDIT_MOVIE_REGEX,
  DELETE_MOVIE_REGEX,
  CREATE_FILE_REGEX,
  LIST_ROLES,
  ADD_PERMISSION_ROLE,
  REMOVE_PERMISSION_ROLE,
  getMovieID,
  hasPermissions,
  lineCount, 
  formatMovieText,
  numberLineFromMessage,
  joinTextWithIndex,
  serverRoles,
  ACTION
};
