const fs = require("fs");
const { MessageEmbed, Permissions } = require('discord.js');
const ParseURLException = require('./exceptions/parseUrlException')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { WriteFileException } = require('./exceptions/handleFileException')

const ADD_MOVIE_REGEX = /^!addMovie\ +[^0-9].*/im;
const EDIT_MOVIE_REGEX = /^!editMovie\ +[0-9]+\ +.*/im;

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

function movieLine(commandLine) {
  const singleSpaceText = eliminateSpaces(commandLine)
  return singleSpaceText.split(/\ /)[1];
}

function eliminateSpaces(commandLine) {
  return commandLine.replace(/[\ ]+/, ' ')
}

function updateMovieLine(newData, commandLine) {
  const editLine = movieLine(commandLine)
  const wholeText = readTextFromFile()
  const searchRegex = editLine + "\\..*\\n"
  const realRegex = new RegExp(searchRegex, 'im')
  console.log(realRegex.toString())
  const formattedText = formatMovieText(newData, editLine);
  const textToWrite = formattedText + '\n';

  if(wholeText.match(realRegex)) {
    console.log('MATCHEO LA REGEX')
  }

  const newText = wholeText.replace(realRegex, textToWrite)
  console.log('text to write: ' + newText)
  try {
    fs.writeFileSync('test.txt', newText, 'utf-8');
  } catch (err) {
    return err
  }
}








async function uploadTextContent(message) {
  // get the file's URL
  const file = message.attachments.first()?.url;
  if (!file) return console.log('No attached file found');

  try {
    message.channel.send('Reading the file! Fetching data...');

    // fetch the file from the external URL
    const response = await fetch(file);

    // if there was an error send a message with the status
    if (!response.ok)
      return message.channel.send(
        'There was an error with fetching the file:',
        response.statusText,
      );

    // take the response stream and read it to completion
    const text = await response.text();

    if (text) {
      message.channel.send(`\`\`\`${text}\`\`\``);
    }
  } catch (error) {
    console.log(error);
  }
}

function readTextFromFile() {
  try {
    const data = fs.readFileSync('test.txt', 'utf8')
    return data.toString()
  } catch (err) {
    console.error(err)
    return err
  }
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

function createTemporaryMessage(msg, text, time) {
  msg.channel.send(text)
    .then(_msg => {
      setTimeout(() => {
        _msg.delete().then(() => msg.delete())
      }, time)
    })
}

function createEmbed(msg, movieData) {
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
      { name: 'vote average', value: movieData.vote_average, inline: true }
	  )
	  .addField('Inline field title', 'Some value here', true)
	  .setImage(movieData.image_url)
	  .setTimestamp()
	  .setFooter({ text: msg.member.displayName, iconURL: msg.author.avatarURL() });

  return embed
}

module.exports = {
  ADD_MOVIE_REGEX,
  EDIT_MOVIE_REGEX,
  getMovieID,
  updateMovieLine,
  hasPermissions,
  lineCount, 
  formatMovieText,
  createEmbed, 
  createTemporaryMessage
};
