const getMovieData = require('./services/tmdb')
const PermissionException = require('./exceptions/permissionException')
const { BaseFileExistsException } = require('./exceptions/fileException')
const { movieFileAlreadyExits, updateAttachMsg } = require('./messages/attachFile')
const { overwritePreviousFile, writeTextToFile } = require('./movie_file/file')
const { getMovieID, ACTION, serverRoles, numberLineFromMessage } = require('./utils')
const { addFailureMessage, addSuccessMessage, formatRolesText, createRoleEmbedText, formatListCommandText } = require('./messages/messages')
const {
	saveRawData,
	updateRawData,
	deleteSelectedMovie,
	savePermissionRole,
	deletePermissionRole,
	getSavedRoles,
	hasPermissions
} = require('./db/db_helpers')

async function addMovie(msg) {
	try {
		await checkForPermissions(msg)
		const data = await getData(msg.content)
		const result = await saveRawData(data, msg)
		await updateServerData(msg, data, result, ACTION.ADD)
	} catch (error) {
		handleError(error, msg)
	}
}

async function editMovie(msg) {
	try {
		await checkForPermissions(msg)
		const data = await getData(msg.content)
		const result = await updateRawData(data, msg)
		await updateServerData(msg, data, result, ACTION.EDIT)
	} catch (error) {
		handleError(error, msg)
	}
}

async function deleteMovie(msg) {
	try {
		await checkForPermissions(msg)
		const result = await deleteSelectedMovie(msg)
		await updateServerData(msg, result.plus_data, result, ACTION.DELETE)
	} catch (error) {
		handleError(error, msg)
	}
}

async function createEmptyFile(msg) {
	try {
		await checkForPermissions(msg)
		if (await movieFileAlreadyExits(msg.channel)) {
			throw new BaseFileExistsException()
		}
		writeTextToFile('(∩ᵔ-ᵔ)⊃━☆ﾟ.mOvIeS: eMpTy*･｡ﾟ')
		await msg.channel.send({ content: '***movies***', files: ['./movie_file/movies.glsl'] })
		addSuccessMessage(msg, { title: 'none' }, ACTION.CREATE_BASE)
	} catch (error) {
		handleError(error, msg)
	}
}

async function listRoles(msg) {
	try {
		await checkForPermissions(msg)
		const roles = serverRoles(msg.guild)
		const savedRoles = await getSavedRoles(msg)
		const text = formatRolesText(roles, savedRoles)
		createRoleEmbedText(msg, text)
	} catch (error) {
		handleError(error, msg)
	}
}

async function addPermisionRole(msg) {
	try {
		await checkForPermissions(msg)
		const data = getRoleData(msg)
		await savePermissionRole(data, msg.guild.id)
		addSuccessMessage(msg, { title: data.name }, ACTION.ADD_ROLE)
	} catch (error) {
		handleError(error, msg)
	}
}

async function removePermissionRole(msg) {
	try {
		await checkForPermissions(msg)
		const data = getRoleData(msg)
		await deletePermissionRole(data, msg.guild.id)
		addSuccessMessage(msg, { title: data.name }, ACTION.REMOVE_ROLE)
	} catch (error) {
		handleError(error, msg)
	}
}

function listCommands(msg) {
	const text = formatListCommandText()
	const title = 'Lista de comandos: '
	const embed = { color: 0x548f6f, title: title, description: text }
	msg.channel.send({ embeds: [embed] })
}

function getRoleData(msg) {
	const roleNumber = numberLineFromMessage(msg.content)
	const roles = serverRoles(msg.guild)
	if (isNaN(roleNumber) || roleNumber > roles.length || roleNumber <= 0) {
		throw new Error('el numero de rol no es valido')
	}
	const data = roles.find(role => role.index == roleNumber)
	if (!data) {
		throw new Error('no se pudo encontrar el rol')
	}
	return data
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
	} catch (e) {
		throw e
	}
}

async function checkForPermissions(msg) {
	if (await hasPermissions(msg)) {
		return true
	} else {
		throw new PermissionException()
	}
}

function handleError(error, msg) {
	addFailureMessage(msg, error.message)
	console.log(error)
}

module.exports = { addMovie, editMovie, deleteMovie, createEmptyFile, listRoles, addPermisionRole, removePermissionRole, listCommands };
