const ParseURLException = require('./exceptions/parseUrlException')

const COMMAND_REGEX = {
  ADD_MOVIE: /^!addMovie\ +[^0-9][^\ ]*$/im,
  EDIT_MOVIE: /^!editMovie\ +[0-9]+\ +[^\ ]*$/im,
  DELETE_MOVIE: /^!deleteMovie\ +[0-9]+$/im,
  CREATE_FILE: /^!createEmptyFile\ */im,
  LIST_ROLES: /^!listRoles\ */im,
  ADD_PERMISSION_ROLE: /^!addPermissionRole\ +[0-9]+$/im,
  REMOVE_PERMISSION_ROLE: /^!removePermissionRole\ +[0-9]+$/im
}

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
		const movieID = movieURI.split(/[^0-9]./)[0]
    if(!movieID || isNaN(movieID)){
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
  COMMAND_REGEX,
  ACTION,
  getMovieID,
  lineCount, 
  formatMovieText,
  numberLineFromMessage,
  joinTextWithIndex,
  serverRoles
};
