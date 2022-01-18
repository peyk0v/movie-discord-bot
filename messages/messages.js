const { MessageEmbed } = require('discord.js')
const { ACTION } = require('../utils')

function addSuccessMessage(msg, movie, action) {
  const embed = { color: 0x548f6f }
  if(action === ACTION.ADD) {
    embed.description = `Se agregó \_\_${movie.title}\_\_ correctamente`
  } else if (action === ACTION.EDIT) {
    embed.description = `Nueva película \_\_${movie.title}\_\_ se editó correctamente`
  } else if (action === ACTION.DELETE) {
    embed.description = `La película fue eliminada correctamente`
  } else if (action === ACTION.CREATE_BASE) {
    embed.description = `Archivo base creado correctamente`
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
  msg.channel.send({embeds: [embed]}).then( _msg => {
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
	  .setTitle(movieData.title)
	  .setAuthor({ name: movieData.main_director.name, iconURL: movieData.main_director.image, url:  movieData.main_director.image})
	  .setDescription('última peli vista')
	  .setThumbnail(movieData.image_url)
	  .addFields(
      { name: '\u200B', value: '\u200B' },
	  	{ name: 'Genres', value: movieData.genres.join(', ') },
	  	{ name: 'director/s', value: movieData.directors.join(', '), inline: true },
	  	{ name: 'release date', value: movieData.release_date, inline: true },
      { name: 'vote average', value: movieData.vote_average.toString(), inline: true }
	  )
	  .addField('Inline field title', 'Some value here', true)
	  .setImage(movieData.image_url)
	  .setTimestamp()
	  .setFooter({ text: msg.member.displayName, iconURL: msg.author.avatarURL() });

  return embed
}

function sendFinalMsg(message, movieData) {
  const embed = createEmbed(message, movieData);
  const text = '\*\*\*movie\*\*\*'
  return message.channel.send({content: text, embeds: [embed], files: ["movie_file/movies.txt"] });
}

module.exports = {
  addSuccessMessage,
  addFailureMessage,
  createTemporaryMessage,
  sendFinalMsg
}