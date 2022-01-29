const { MessageEmbed } = require('discord.js')
const { ACTION } = require('../utils')

function addSuccessMessage(msg, data, action) {
  const embed = { color: 0x548f6f }
	switch(action) {
		case ACTION.ADD:
			embed.description = `Se agregó \_\_${data.title}\_\_ correctamente`
			break;
		case ACTION.EDIT:
			embed.description = `Nueva película \_\_${data.title}\_\_ se editó correctamente`
			break;
		case ACTION.DELETE:
			embed.description = `La película fue eliminada correctamente`
			break;
		case ACTION.CREATE_BASE:
			embed.description = `Archivo base creado correctamente`
			break;
		case ACTION.ADD_ROLE:
			embed.description = `Rol: ${data.title} agregado correctamente`
			break;
		case ACTION.REMOVE_ROLE:
			embed.description = `Rol: ${data.title} fue removido correctamente`
			break;
	}

	msg.channel.send({embeds: [embed]}).then( _msg => {
    msg.delete()
    setTimeout(() => {_msg.delete()}, 10000)
	})
}

function addFailureMessage(msg, text) {
  const embed = {
    color: 0xff0000,
    description: 'Error: ' + text
  }
  msg.channel.send({ embeds: [embed] }).then( _msg => {
    msg.delete()
    setTimeout(() => {_msg.delete()}, 10000)
  })
}

function createTemporaryMessage(msg, text, time) {
  msg.channel.send(text)
    .then(_msg => {
      setTimeout(() => { _msg.delete() }, time)
    })
}

function createEmbed(msg, movieData) {
  if(movieData === undefined) {
    return { color: 0x548f6f, description: 'no hay películas' }
  }

  const embed = new MessageEmbed()
	  .setColor('#548f6f')
	  .setTitle('\`' + movieData.title + '\`')
	  .setAuthor({ name: movieData.main_director.name, iconURL: movieData.main_director.image, url:  movieData.main_director.image})
	  .setDescription('_*Última película vista*_')
	  .setThumbnail(movieData.image_url)
	  .addFields(
      { name: '\u200B', value: '\u200B' },
	  	{ name: 'Director/s', value: movieData.directors.join(', ') },
	  	{ name: 'Genres', value: movieData.genres.join(', ') },
	  	{ name: 'Release Date', value: movieData.release_date, inline: true },
      { name: 'Vote Average', value: movieData.vote_average.toString(), inline: true }
	  )
	  //.setImage(movieData.image_url)
	  .setTimestamp()
	  .setFooter({ text: msg.member.displayName, iconURL: msg.author.avatarURL() });

  return embed
}

function formatRolesText(serverRoles, savedRoles) {
  const savedRolesId = savedRoles.map(role => role.id)
  let rolesText = []
  for(let role of serverRoles) {
    if(savedRolesId.includes(role.id)) {
      rolesText.push('***' + role.index + '***' + ' - ' + role.name) 
    } else {
      rolesText.push('***' + role.index + '***' + ' - ' + '~~' + role.name + '~~')
    }
  }
  return rolesText.join('\n')
}

function createRoleEmbedText(msg, rolesText) {
  const text = 'Los roles que figuran tachado no pueden hacer uso del bot: \n'
    + '\n'
    + rolesText
    + '\n'
    + '\n Para agregar permisos de uso a un rol: _!addPermissionRole_ ***NUMERO***'
    + '\n Para remover permisos de uso a un rol: _!removePermissionRole_ ***NUMERO***'
  
  msg.channel.send({ embeds: [{ color: 0x548f6f, description: text }] })
}

function sendFinalMsg(message, movieData) {
  const embed = createEmbed(message, movieData);
  const text = '***Películas vistas***'
  return message.channel.send({ content: text, embeds: [embed], files: ["movie_file/movies.glsl"] });
}

module.exports = {
  addSuccessMessage,
  addFailureMessage,
  createTemporaryMessage,
  formatRolesText,
  createRoleEmbedText,
  sendFinalMsg
}
