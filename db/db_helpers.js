const Movie = require('./schemas/movie')
const { Permissions } = require('discord.js');
const DBException = require('../exceptions/dbException')
const { formatMovieText, numberLineFromMessage } = require('../utils')
const { saveMovie, getAllMovies, updateMovie, deleteMovie, saveRole, deleteRole, getAllRoles } = require('./dbEntries')

async function saveRawData(movieData, msg) {
  try {
    const serverId = msg.guild.id
    const newMovie = adaptDataToSchema(movieData, serverId)
    const addedMovie = await saveMovie(newMovie)
    const allServerMovies = await getAllMovies(serverId)
    return {
      all_movies: allServerMovies,
      plus_data: addedMovie
    }
  } catch(e) {
    throw e
  }
}

async function updateRawData(newData, msg) {
  try {
    const serverId = msg.guild.id
    let movies = await getAllMovies(serverId)
    const { data, line } = getDesireData(msg.content, movies)
    const adaptedNewData = fieldsToUpdate(newData)
    const result = await updateMovie({ _id: data._id }, adaptedNewData)
    movies[line - 1] = result
    return {
      all_movies: movies,
      plus_data: data
    }
  } catch(e) {
    throw e
  }
}

async function deleteSelectedMovie(msg) {
  try {
    const serverId = msg.guild.id
    const movies = await getAllMovies(serverId)
    const { data, line } = getDesireData(msg.content, movies)
    await deleteMovie({ _id: data._id })
    const surviveMovies = movies.filter(movie => movie !== data)
    return {
      all_movies : surviveMovies,
      plus_data: surviveMovies.at(-1)
    }
  } catch(e) {
    throw e
  }
}

function getDesireData(content, movies) {
  const line = numberLineFromMessage(content)
  if(line <= 0 || line > movies.length) {
    throw new Error('el numero de linea a editar no es valido')
  }
  return { data: movies[line - 1], line: line } 
}

async function savePermissionRole(role, serverID) {
  const data = { name: role.name, id: role.id, server_id: serverID }
  await saveRole(data)
}

async function deletePermissionRole(role, serverID) {
  const filter = { name: role.name, id: role.id, server_id: serverID }
  await deleteRole(filter)
}

async function getSavedRoles(msg) {
  try {
    return await getAllRoles(msg.guild.id)
  } catch(error) {
    throw error
  }
}

function adaptDataToSchema(movieData, serverId) {
  const text = formatMovieText(movieData);
  const newMovie = {
    ...movieData, 
    vote_average: Number(movieData.vote_average),
    server_id: serverId,
    seen_date: new Date(),
    line_text: text
  }
  return newMovie
}

function fieldsToUpdate(movieData) {
  const newText = formatMovieText(movieData)
  const newMovie = {
    ...movieData,
    vote_average: Number(movieData.vote_average),
    line_text: newText
  }
  return newMovie
}

async function hasPermissions(msg) {
  try {
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
  } catch(e) {
    throw e
  }
}

module.exports = { saveRawData, updateRawData, deleteSelectedMovie, savePermissionRole, deletePermissionRole, getSavedRoles, hasPermissions }
